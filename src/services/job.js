import { pad2, getMonth } from './var';

/** @return {{periods: [object], dateTags: [string]}} */
export const modifyPeriodsFromHttpData = (periods) => {
  const sortedPeriods = periods.map(p => {
    if (p.date) {
      p.date = new Date(p.date);
      p.date.setHours(0, 0, 0, 0);
    }
    if (p.start_time) p.start_time = new Date(p.start_time);
    if (p.end_time) p.end_time = new Date(p.end_time);
    return p;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
  const afterTodayPeriods = [];
  const condensedPeriods = [];
  sortedPeriods.forEach(p => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (today < p.date) afterTodayPeriods.push(p);
  });
  let condensedPeriodsIndex;
  afterTodayPeriods.forEach(period => {
    if (condensedPeriods.length === 0) {
      condensedPeriods.push([period]);
      condensedPeriodsIndex = 0;
    } else {
      const currentArr = condensedPeriods[condensedPeriodsIndex];
      const prevDate = currentArr[currentArr.length - 1].date;
      const isOneDayDifferent = (prevDate.getMonth() === period.date.getMonth()) && ((period.date.getDate() - prevDate.getDate()) === 1);
      if (isOneDayDifferent) currentArr.push(period);
      else {
        condensedPeriods.push([period]);
        condensedPeriodsIndex ++;
      }
    }
  });
  const dateTags = condensedPeriods.map(arr => {
    let str;
    if (arr.length === 1) {
      const d = arr[0].date;
      str = getMonth(d.getMonth()) + " " + pad2(d.getDate());
    } else if (arr.length > 1) {
      const d1 = arr[0].date;
      const d2 = arr[arr.length - 1].date;
      str = getMonth(d1.getMonth()) + " " + pad2(d1.getDate()) + " - " + pad2(d2.getDate());
    } else {
      return "...";
    }
    return str;
  });
  // const dateTags = afterTodayPeriods.map(p => p.date.getDate() + " " + Variable.getMonth(p.date.getMonth())); // for ungrouped dates
  return {periods: afterTodayPeriods, dateTags};
}

/** sort periods, discard unwanted periods, sort jobs according to periods or updated_at
* @return {[object]} @param {[object]} jobs */
export const processJobsDataFromHttp = (jobs) => {
  const hasPeriod = obj => !!obj.periods && obj.periods.length > 0;
  const getPeriodDate = obj => new Date(obj.periods[0].date);
  const getUpdatedDate = obj => new Date(obj.updated_at);
  return jobs.map(job => {
    const periodObj = modifyPeriodsFromHttpData(job.periods);
    job.periods = periodObj.periods;
    job.date_tags = periodObj.dateTags || null;
    return job;
  }).sort((a, b) => {
    return new Date(b.updated_at) - new Date(a.updated_at);
    // const aHasPeriods = hasPeriod(a);
    // const bHasPeriods = hasPeriod(b);
    // if (aHasPeriods && bHasPeriods) return getPeriodDate(a) - getPeriodDate(b);
    // else if (!aHasPeriods && bHasPeriods) return 1;
    // else if (aHasPeriods && !bHasPeriods) return -1;
    // return getUpdatedDate(b) - getUpdatedDate(a); // (!aHasPeriods && !bHasPeriods)
  });
}
