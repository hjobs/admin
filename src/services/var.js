import { salaryChoices, months, jobType } from '../stores/data/misc';

/** @return {[string]} */
const inspectJobError = (state) => {
  const errors = [];
  const job = state.job;
  if (!job.title) errors.push("Please input title");
  if (!job.description) errors.push("Please input description");
  switch (job.salary_type) {
    case "specific":
      if (!job.salary_value) errors.push("Salary information is incomplete");
      break;
    case "range":
      if (!job.salary_high || !job.salary_low) errors.push("Please specify the salary");
      break;
    case "negotiable": break;
    default:
      errors.push("Please specify the salary");
      break;
  }
  if (state.isEvent && !job.event) errors.push("Please input event name");
  if (state.hasLang && !job.langs) errors.push("Please specify language requirements");
  switch (state.progress.period) {
    case 0:
      errors.push("Please specify date");
      break;
    case 1:
      errors.push("Please specify time");
      break;
    default: break;
  }
  return errors;
}

const httpJobReducer = {
  rewardReducer: (job) => {
    let chosen, toChoose;
    if (!!job.salary_type) {
      // determine "chosen"
      chosen = [];
      const salaryType = salaryChoices.monetary1.reduce((result, curr) => {
        if (!!result) return result;
        if (curr.value === job.salary_type) return curr;
      }, null);
      console.log(["salaryType", job.salary_type, salaryType]);
      chosen.push(salaryType);
      // determine "toChoose"
      let obj = salaryType;
      while (obj.nextPointer !== null && !salaryChoices[obj.nextPointer].customRender) {
        chosen.push(salaryChoices[obj.nextPointer]);
      }
      toChoose = !!obj.nextPointer ? salaryChoices[obj.nextPointer] : null;
    } else {
      chosen = [];
      toChoose = salaryChoices.monetary1;
    }


    return {chosen, toChoose};
  },

  /** @param {[{date: any, start_time: any, end_time: any}]} periods */
  periodReducer: (periods) => {
    let data = {
      dateArr: [],
      startTimeHour: "",
      startTimeMinute: "",
      endTimeHour: "",
      endTimeMinute: ""
    }
    if (!!periods && periods.length > 0) {
      data.dateArr = periods.map(p => new Date(p.date));
      const startTime = new Date(periods[0].start_time);
      const endTime = new Date(periods[0].end_time);
      data.startTimeHour = startTime.getHours();
      data.startTimeMinute = startTime.getMinutes();
      data.endTimeHour = endTime.getHours();
      data.endTimeMinute = endTime.getMinutes();
    }
    return data;
  },

  progressReducer: (job) => ({
    period: job.periods.length <= 0 ? -1 : 2
  })
}

/** @return {number} - 2 digit @param {number} num - 1 to 2 digit */
const pad2 = (num) => { return (num < 10) ? '0' + num.toString() : num; };

const Variable = {
  salaryChoices,
  jobType,
  pad2, 
  /** @return {"Jan"| "Feb"| "Mar"| "Apr"| "May"| "Jun"| "Jul"| "Aug"| "Sep"| "Oct"| "Nov"| "Dec"} @param {0|1|2|3|4|5|6|7|8|9|10|11} num */
  
  getMonth: (num) => { return months[num]; },
  /** @return {string} @param {string} word */
  
  capitalize: (word) => { const arr = word.split(""); arr[0].toUpperCase(); return arr.join(""); },

  /** @return {'? to ?'|'?'|'negotiable'} */
  getSalaryDescription: (job) => {
    let salaryDescription = "";
    switch (job.salary_type) {
      case "range":
        salaryDescription = job.salary_high + " - " + job.salary_low;
        break;
      case "specific":
        salaryDescription = job.salary_value;
        break;
      case "negotiable": default:
        salaryDescription = "negotiable";
        break;
    }
    return salaryDescription;
  },

  /** @param {'date'|'time'|'datetime'} format */
  customTimeStamp: (date, format)  => {
    return (
      ((/time/g.test(format)) ? pad2(date.getHours()) + ":" + pad2(date.getMinutes()) : "") +
      (format === "datetime" ? ", " : "") +
      ((/date/g.test(format)) ? pad2(date.getDate()) + "-" + pad2(date.getMonth() + 1) + "-" + date.getFullYear() : "")
    );
  },

  /** @return {{error: [string]|null, data: object}} */
  getJobHttpObject: (state) => {
    let error = inspectJobError(state);
    if (error.length > 0) return {error, data: null};
    error = null;
    const job = state.job;
    const obj = {
      id: job.id,
      title: job.title,
      description: job.description,
      event: job.event,
      attachment_url: job.attachment_url,
      employment_type: job.employment_type,
      job_type: job.job_type,
      salary_type: job.salary_type,
      salary_value: job.salary_value,
      salary_high: job.salary_high,
      salary_low: job.salary_low,
      salary_unit: job.salary_unit,
      langs: job.langs.map(l => l)
    };
    if (state.progress.period > 0) {
      const timeNotEmpty = !!state.period.startTimeHour && !!state.period.startTimeMinute && !!state.period.endTimeHour && !!state.period.endTimeMinute;

      const periods = state.period.dateArr.map(d => ({date: d}));
      if (timeNotEmpty) {
        periods.forEach(p => {
          p.start_time = new Date(p.date.getFullYear(), p.date.getMonth(), p.date.getDate(), state.period.startTimeHour, state.period.startTimeMinute);
          p.end_time = new Date(p.date.getFullYear(), p.date.getMonth(), p.date.getDate(), state.period.endTimeHour, state.period.endTimeMinute);
        });
      }
      obj.periods = periods;
    }
    return {error: null, data: obj};
  },

  getStateFromJob: (job, loading) => {
    const hasJob = !!job;
    return {
      error: false,
      jobModal: {
        job: {
          id: hasJob ? job.id : null,
          title: hasJob ? job.title : "",
          description: hasJob ? job.description || "" :"",
          event: hasJob ? job.event || "" :"",
          langs: hasJob ? job.langs.map(lang =>  lang.name) || [] : [],
          attachment_url: hasJob ? job.attachment_url || [] : "",
          employment_types: hasJob ? job.employment_types.map(et => et.name) || [] : [],
          job_type: hasJob ? job.job_type || "quick" : "quick",
          salary_type: hasJob ? job.salary_type || "" : "",
          salary_value: hasJob ? job.salary_value || "" : "",
          salary_high: hasJob ? job.salary_high || "" : "",
          salary_low: hasJob ? job.salary_low || "" : "",
          salary_unit: hasJob ? job.salary_unit || "" : "hour"
        },
        reward: hasJob ? httpJobReducer.rewardReducer(job) : {
          chosen: [],
          toChoose: Variable.salaryChoices.monetary1
        },
        period: hasJob ? httpJobReducer.periodReducer(job.periods) : {
          dateArr: [],
          startTimeHour: "",
          startTimeMinute: "",
          endTimeHour: "",
          endTimeMinute: ""
        },
        progress: hasJob ? httpJobReducer.progressReducer(job) : {
          // reward: 0,
          period: 0
        },
        isEvent: hasJob ? !!job.event : false,
        hasLang: hasJob ? !!job.langs : false,
        loading: loading,
        errorMessage: null
      }
    }
  },

  /** @param {'endTimeHour'|'endTimeMinute'|'startTimeHour'|'startTimeMinute'} id @param {object} periodObj @return {number} */
  // getTimeInputMax(id, periodObj) {
  //   let max;
  //   switch (id) {
  //     case "endTimeHour":
  //       max = 23;
  //       break;
  //     case "endTimeMinute":
  //       max = 59;
  //       break;
  //     case "startTimeHour": case "startTimeMinute": default:
  //       max = periodObj[id.replace("startTime", "endTime")];
  //       break;
  //   }
  //   return max;
  // }
}

export default Variable;
