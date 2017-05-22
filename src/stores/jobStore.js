import Reflux from 'reflux';

import { getIndexInArrFromId } from '../services/var';
import Http from '../services/http';
import { processJobsDataFromHttp } from '../services/job';

import { UserActions } from './userStore';

export const JobActions = Reflux.createActions({
  loadJob: {asyncResult: true},
  loadJobs: {asyncResult: true},
  loadProfile: {asyncResult: true},
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
        error: null
      },
      viewJob: {
        data: null,
        loading: false,
        error: null
      },
      viewProfile: {
        data: null,
        loading: false,
        error: null
      }
    };
  }

  loadJobs() {
    const jobs = this.state.jobs;
    jobs.loading = true;
    jobs.error = null;
    this.setState({jobs});

    Http.request("orgs/showPostings").then(res => {
      if (res.ok) return res.json();
      throw Error(res.statusText);
    })
    .then(d => {
      // console.log(["received jobs, logging data", d]);
      if (d === null || d === undefined || !!d.error) throw Error("There has been an error");
      this.loadCompleted("jobs", processJobsDataFromHttp(d));
    })
    .catch(err => this.loadFailed("jobs", err.toString()));
  }

  /** @param {number} id */
  loadJob(id) {
    const viewJob = this.state.viewJob;
    viewJob.loading = true;
    this.setState({viewJob});
    
    Http.request("jobs/" + id).then(res => {
      if (res.ok) return res.json();
      throw Error(res.statusText);
    }).then(d => {
      if (!d.toString() || !!d.error) throw Error("There has been an error");
      this.loadCompleted("viewJob", d);
    }).catch(err => this.loadFailed("viewJob", err.toString()))
  }

  /** @param {number} id */
  loadProfile(id) {
    const viewProfile = this.state.viewProfile
    viewProfile.loading = true;
    this.setState({viewProfile});

    Http.request("employees/" + id).then(res => {
      if (res.ok) return res.json();
      throw Error(res.statusText);
    }).then(d => {
      if (!d || !!d.error) throw Error("There has been an error");
      this.loadCompleted("viewProfile", d);
    }).catch(err => this.loadFailed("viewProfile", err.toString()))
  }


  /** @param {"jobs"|"viewJob"|"viewProfile"} key */
  loadCompleted(key, data) {
    const obj = {};
    obj[key] = this.state[key];
    obj[key].loading = false;
    obj[key].data = data;
    obj[key].error = null;
    this.setState(obj);
  }

  /** @param {"jobs"|"viewJob"|"viewProfile"} key */
  loadFailed(key, reason) {
    const obj = {};
    obj[key] = this.state[key];
    obj[key].loading = false;
    obj[key].data = null;
    obj[key].error = reason;
    this.setState(obj);
  }












  /** delete with param index in this.state.jobs.data array @param {number} index */
  delete(jobId) {
    this.state.jobs.loading = true;
    this.state.jobs.error = null;
    this.trigger(this.state);

    Http.request("jobs/" + jobId, "DELETE").then(res => res.json())
    .then(d => {
      this.deleteCompleted(jobId);
    }).catch(err => this.deleteFailed(err));
  }

  /** @param {number} index - index to remove from this.state.jobs.data */
  deleteCompleted(jobId) {
    const index = getIndexInArrFromId(jobId, this.state.jobs.data);
    this.state.jobs.data.splice(index, 1);
    this.state.jobs.loading = false;
    this.state.jobs.error = null;
    this.trigger(this.state);
  }

  /** @param {string} reason */
  deleteFailed(reason) {
    if (!reason) reason = "There has been an error. Please check your internet connection, or contact us at info@hjobs.hk."
    const jobs = this.state.jobs;
    jobs.loading = false;
    jobs.error = reason;
    this.setState({jobs});
  }
}

export default JobStore;
