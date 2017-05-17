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
export const pad2 = (num) => { return (num < 10) ? '0' + num.toString() : num; };
/** @return {"Jan"| "Feb"| "Mar"| "Apr"| "May"| "Jun"| "Jul"| "Aug"| "Sep"| "Oct"| "Nov"| "Dec"} @param {0|1|2|3|4|5|6|7|8|9|10|11} num */
export const getMonth = (num) => { return months[num]; }
/** @param {'date'|'time'|'datetime'} format */
export const customTimeStamp = (date, format = 'date')  => {
  return (
    ((/time/g.test(format)) ? pad2(date.getHours()) + ":" + pad2(date.getMinutes()) : "") +
    (format === "datetime" ? ", " : "") +
    ((/date/g.test(format)) ? pad2(date.getDate()) + "-" + pad2(date.getMonth() + 1) + "-" + date.getFullYear() : "")
  );
}
/** @return {string} @param {string} word */
export const capitalize = (word) => { const arr = word.split(""); arr[0].toUpperCase(); return arr.join(""); };

/** @return {'? to ?'|'?'|'negotiable'} */
export const getSalaryDescription = (job) => {
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
}

export const urgencyTypes = [
  {value: "urgent1", className: "traffic-red"},
  {value: "urgent2", className: "traffic-orange"},
  {value: "urgent3", className: "traffic-blue"}
];
/** @return {trafficString} @param {*} job */
export const getColorClass = (job) => {
  let colorClass;
  if (!!job.periods && job.periods.length > 0) {
    const earliestDate = job.periods.reduce((result, curr) => {
      let currTime;
      if (!!curr.start_time) currTime = new Date(curr.start_time);
      else if (!!curr.date) currTime = new Date(curr.date);
      else return result || null;
      return (!result || currTime - result < 0) ? currTime : result;
    }, null);
    if (!earliestDate) return urgencyTypes[2].className;

    const now = new Date();
    const daysDifference = (earliestDate - now) / 86400000; // 86400000 = 1 day
    if (daysDifference < 0) colorClass = urgencyTypes[2].className;
    else if (daysDifference < 7) colorClass = urgencyTypes[0].className;
    else if (daysDifference < 14) colorClass = urgencyTypes[1].className;
    else colorClass = urgencyTypes[2].className;
  } else {
    colorClass = urgencyTypes[2].className;
  }
  return colorClass;
};

/** get index in arr by comparing against ids,
* @return {'-1'|number} @param {objectWithId} data @param {objectWithId[]} arr */
export const getIndexInArrFromId = (id, arr) => {
  if (!id || !arr) { throw Error('no data or no arr'); }
  return arr.reduce((result, curr, i) => {
    if (curr.id === id) return i;
    return result;
  }, -1);
};

const Variable = {
  salaryChoices,
  jobType,
  pad2, 
  getMonth,
  capitalize,
  getSalaryDescription,
  customTimeStamp,

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
      has_bonus: job.has_bonus,
      bonus_value: job.bonus_value,
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
          langs: hasJob ? job.langs.map(lang =>  lang.code) || [] : [],
          attachment_url: hasJob ? job.attachment_url || [] : "",
          employment_types: hasJob ? job.employment_types.map(et => et.name) || [] : [],
          job_type: hasJob ? job.job_type || null : null,
          salary_type: hasJob ? job.salary_type || "" : "",
          salary_value: hasJob ? job.salary_value || "" : "",
          salary_high: hasJob ? job.salary_high || "" : "",
          salary_low: hasJob ? job.salary_low || "" : "",
          salary_unit: hasJob ? job.salary_unit || "" : "hour",
          has_bonus: hasJob ? job.has_bonus || false : false,
          bonus_value: hasJob ? job.bonus_value || "" : ""
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
  }
}

export default Variable;
