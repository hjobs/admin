import { salaryChoices, months, jobType } from '../stores/data/misc';

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

export const mergeStyles = (defaultStyle, addOnStyle) => {
  if (!addOnStyle) return defaultStyle;
  for (let key in addOnStyle) {
    defaultStyle[key] = addOnStyle[key];
  }
  return defaultStyle;
}

const Variable = {
  salaryChoices,
  jobType,
  pad2, 
  getMonth,
  capitalize,
  getSalaryDescription,
  customTimeStamp
}

export default Variable;
