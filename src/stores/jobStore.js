import Reflux from 'reflux';

import Variable from '../services/var';
import Http from '../services/http';

import { UserActions } from './userStore';

// export const JobActions = Reflux.createActions([
//   "loadJobs"
// ]);

export const JobActions = Reflux.createActions({
  loadJobs: {asyncResult: true},
  delete: {asyncResult: true}
});

class JobStore extends Reflux.Store {
  constructor() {
    super();
    this.state = this.getState();
    this.listenables = JobActions;
    if (localStorage.getItem("authToken")) this.loadJobs()
  }

  getState() {
    return {
      jobs: {
        data: null,
        loading: false,
        error: false
      }
    };
  }

  init() {
    console.log("jobStore init called");
  }

  // componentWillMount() {
  //   Reflux.Component.prototype.componentWillMount.call(this);
  //   if (localStorage.getItem("authToken")) this.loadJobs();
  // }

  loadJobs() {
    const onError = (err) => {
      this.setState(s => {
        s.jobs.loading = false;
        s.jobs.error = err;
        return s;
      }, () => { UserActions.logout(); });
    };

    this.state.jobs.loading = true;
    this.state.jobs.error = null;
    this.trigger(this.state);

    Http.request("orgs/showPostings").then(res => {
      console.log(res);
      if (res.ok) return res.json();
      throw Error(res.statusText);
    }, err => onError(err))
    .then(d => {
      this.loadJobsCompleted(d)
      // console.log(["got jobs, log d from server", d]);
      // if (d && d.org) {
      //   this.setState(s => {
      //     s.jobs.data = this.processJobsDataFromHttp(d);
      //     s.jobs.loading = false;
      //     s.jobs.error = null;
      //     return s;
      //   });
      // }
    })
    .catch(err => this.loaddJobsFailed(err));

    // this.setState(s => {
    //   s.jobs.loading = true;
    //   s.jobs.error = null;
    //   return s;
    // }, () => {
    //   console.log("Http.req called");
    //   Http.request("orgs/showPostings").then(res => {
    //     console.log(res);
    //     if (res.ok) return res.json();
    //     throw Error(res.statusText);
    //   }, err => onError(err))
    //   .then(d => {
    //     this.loadJobsCompleted(d)
    //     // console.log(["got jobs, log d from server", d]);
    //     // if (d && d.org) {
    //     //   this.setState(s => {
    //     //     s.jobs.data = this.processJobsDataFromHttp(d);
    //     //     s.jobs.loading = false;
    //     //     s.jobs.error = null;
    //     //     return s;
    //     //   });
    //     // }
    //   })
    //   .catch(err => onError(err));
    // });
  }

  loadJobsCompleted(data) {
    console.log(["loadJobsCompleted", data]);
    this.state.jobs.data = this.processJobsDataFromHttp(data.jobs);
    this.state.jobs.loading = false;
    this.state.jobs.error = null;
    this.trigger(this.state);
  }

  loaddJobsFailed(reason) {
    this.state.jobs.loading = false;
    this.state.jobs.error = reason;
    this.trigger(this.state);
  }

  /** delete with param index in this.state.jobs.data array @param {number} index */
  delete(index) {
    this.state.jobs.loading = true;
    this.state.jobs.error = null;
    this.trigger(this.state);

    const job = this.state.jobs.data[index];
    console.log(job);

    Http.request("jobs/" + job.id, "DELETE").then(res => res.json())
    .then(d => {
      this.deleteCompleted(index);
    }).catch(err => this.deleteFailed(err));
  }

  /** @param {number} index - index to remove from this.state.jobs.data */
  deleteCompleted(index) {
    this.state.jobs.data.splice(index, 1);
    this.state.jobs.loading = false;
    this.state.jobs.error = null;
    this.trigger(this.state);
  }

  deleteFailed(reason) {
    if (!reason) reason = "There has been an error. Please check your internet connection, or contact us at info@hjobs.hk."
    window.alert(reason);
    this.state.jobs.loading = false;
    this.state.jobs.error = reason;
    this.trigger(this.state);
  }

  /** sort periods, discard unwanted periods, sort jobs according to periods or updated_at
   * @return {[object]}
   * @param {[object]} jobs
   * */
  processJobsDataFromHttp(jobs) {
    const hasPeriod = obj => !!obj.periods && obj.periods.length > 0;
    const getPeriodDate = obj => new Date(obj.periods[0].date);
    const getUpdatedDate = obj => new Date(obj.updated_at);
    return jobs.map(job => {
      const periodObj = this.modifyPeriodsFromHttpData(job.periods);
      job.periods = periodObj.periods;
      job.date_tags = periodObj.dateTags || null;
      return job;
    }).sort((a, b) => {
      const aHasPeriods = hasPeriod(a);
      const bHasPeriods = hasPeriod(b);
      if (aHasPeriods && bHasPeriods) return getPeriodDate(a) - getPeriodDate(b);
      else if (!aHasPeriods && bHasPeriods) return 1;
      else if (aHasPeriods && !bHasPeriods) return -1;
      return getUpdatedDate(b) - getUpdatedDate(a); // (!aHasPeriods && !bHasPeriods)
    });
  }

  /** @return {{periods: [object], dateTags: [string]}} */
  modifyPeriodsFromHttpData(periods) {
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
        str = Variable.getMonth(d.getMonth()) + " " + Variable.pad2(d.getDate());
      } else if (arr.length > 1) {
        const d1 = arr[0].date;
        const d2 = arr[arr.length - 1].date;
        str = Variable.getMonth(d1.getMonth()) + " " + Variable.pad2(d1.getDate()) + " - " + Variable.pad2(d2.getDate());
      } else {
        return "...";
      }
      return str;
    });
    // const dateTags = afterTodayPeriods.map(p => p.date.getDate() + " " + Variable.getMonth(p.date.getMonth())); // for ungrouped dates
    return {periods: afterTodayPeriods, dateTags};
  }
}

export default JobStore;
