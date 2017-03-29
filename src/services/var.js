const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class Variable {
  constructor() {
    this.salaryChoices = {
      root: [
        {
          name: "Salary",
          value: "monetary",
          prevPointer: null,
          selfPointer: "root",
          nextPointer: "monetary1"
        },
        // {
        //   name: "Certification",
        //   value: "cert",
          // prevPointer: null,
          // selfPointer: "root",
        //   nextPointer: "cert1"
        // },
        {
          name: "Others",
          value: "others",
          prevPointer: null,
          selfPointer: "root",
          nextPointer: "others"
        }
      ],
      monetary1: [
        {
          name: "Range",
          value: "range",
          fieldName: "salary_type",
          prevPointer: "root",
          nextPointer: "moneyRange",
          selfPointer: "monetary1"
        },
        {
          name: "Specific",
          value: "specific",
          fieldName: "salary_type",
          prevPointer: "root",
          selfPointer: "monetary1",
          nextPointer: "moneySpecific"
        },
        {
          name: "Negotiable",
          value: "negotiable",
          fieldName: "salary_type",
          prevPointer: "root",
          selfPointer: "monetary1",
          nextPointer: null
        }
      ],
      moneyRange: {customRender: true, value: "moneyRange"},
      moneySpecific: {customRender: true, value: "moneySpecific"},
      others: {customRender: true, value: "others"}
    };
    this.jobType = [
      {
        name: "Quick Job",
        value: "quick"
      },
      {
        name: "Stable Job",
        value: 'stable'
      },
      {
        name: "Internship",
        value: 'intern'
      },
      {
        name: "Project",
        value: 'project'
      }
    ];
  }

  /** @return {number} - 2 digit @param {number} num - 1 to 2 digit */
  pad2(num) { return (num < 10) ? '0' + num.toString() : num; }
  /** @return {"Jan"| "Feb"| "Mar"| "Apr"| "May"| "Jun"| "Jul"| "Aug"| "Sep"| "Oct"| "Nov"| "Dec"} @param {0|1|2|3|4|5|6|7|8|9|10|11} num */
  getMonth(num) { return months[num]; }
  /** @return {string} @param {string} word */
  capitalize(word) { const arr = word.split(""); arr[0].toUpperCase(); return arr.join(""); }

  /** @return {'? to ?'|'?'|'negotiable'} */
  getSalaryDescription(job) {
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
  /** @param {'date'|'time'|'datetime'} format */
  customTimeStamp(date, format) {
    return (
      ((/time/g.test(format)) ? this.pad2(date.getHours()) + ":" + this.pad2(date.getMinutes()) : "") +
      (format === "datetime" ? ", " : "") +
      ((/date/g.test(format)) ? this.pad2(date.getDate()) + "-" + this.pad2(date.getMonth() + 1) + "-" + date.getFullYear() : "")
    );
  }
  /** @return {{error: [string]|null, data: object}} */
  getJobHttpObject(modalState) {
    let error = this.inspectJobError(modalState);
    if (error.length > 0) return {error, data: null};
    error = null;
    const job = modalState.job;
    const obj = {
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
    if (modalState.progress.period > 0) {
      const timeNotEmpty = !!modalState.period.startTimeHour && !!modalState.period.startTimeMinute && !!modalState.period.endTimeHour && !!modalState.period.endTimeMinute;

      const periods = modalState.period.dateArr.map(d => ({date: d}));
      if (timeNotEmpty) {
        periods.forEach(p => {
          p.start_time = new Date(p.date.getFullYear(), p.date.getMonth(), p.date.getDate(), modalState.period.startTimeHour, modalState.period.startTimeMinute);
          p.end_time = new Date(p.date.getFullYear(), p.date.getMonth(), p.date.getDate(), modalState.period.endTimeHour, modalState.period.endTimeMinute);
        });
      }
      obj.periods = periods;
    }
    return {error: null, data: obj};
  }

  /** @return {[string]} */
  inspectJobError(modalState) {
    const errors = [];
    const job = modalState.job;
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
    if (modalState.isEvent && !job.event) errors.push("Please input event name");
    if (modalState.hasLang && !job.langs) errors.push("Please specify language requirements");
    switch (modalState.progress.period) {
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
}

export default Variable;
