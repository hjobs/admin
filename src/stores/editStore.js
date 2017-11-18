import Reflux from 'reflux';
import clone from 'clone';

// import Var from '../services/var';
import { request } from '../services/http';
import { yyyymmddhhmmss } from '../services/var';
import { uploadPhoto, strip } from '../services/upload';
import { salaryChoices, jobSalaryFields } from './data/misc';

export const EditActions = Reflux.createActions({
  loadJob: {asyncResult: true},
  changeJobType: {},
  setLoading: {},
  editJob: {},
  rewardChangeChoice: {},
  periodChange: {},
  toggleEvent: {},
  toggleLangs: {},
  save: {asyncResult: true},
  reset: {}
});

const inputIsEmpty = (val) => {
  if (val === "" || val == null) return true;
  return false;
}

/** @return {[string]} */
const inspectJobError = (state) => {
  const errors = [];
  const { job, reward, event, langs, progress } = state;
  if (!job.title) errors.push("Please input title");
  if (!job.description) errors.push("Please input description");
  switch (reward.salary_type) {
    case "specific":
      if (inputIsEmpty(reward.salary_value) || inputIsEmpty(reward.salary_value)) errors.push("Salary information is incomplete");
      break;
    case "range":
      if (inputIsEmpty(reward.salary_high) || inputIsEmpty(reward.salary_low)) errors.push("Please specify the salary");
      break;
    case "negotiable": break;
    default:
      errors.push("Please specify the salary");
      break;
  }
  if (event.isEvent && !event.event) errors.push("Please input event name");
  if (langs.hasLang && !langs.langs) errors.push("Please specify language requirements");
  switch (progress.period) {
    case 0:
      errors.push("Please specify date");
      break;
    case 1:
      errors.push("Please specify time");
      break;
    default: break;
  }
  return errors.length > 0 ? errors : null;
}

/** @return {{error: [string]|null, data: object}} */
export const getJobHttpObject = (state) => {
  let returnObject = {error: inspectJobError(state), data: null};
  if (!!returnObject.error > 0) return returnObject;
  const job = clone(state.job);
  if (state.progress.period > 0) {
    const timeNotEmpty = !!state.periods.startTimeHour && !!state.periods.startTimeMinute && !!state.periods.endTimeHour && !!state.periods.endTimeMinute;
    const periods = state.periods.dateArr.map(d => ({date: d}));
    if (timeNotEmpty) {
      periods.forEach(p => {
        p.start_time = new Date(p.date.getFullYear(), p.date.getMonth(), p.date.getDate(), state.periods.startTimeHour, state.periods.startTimeMinute);
        p.end_time = new Date(p.date.getFullYear(), p.date.getMonth(), p.date.getDate(), state.periods.endTimeHour, state.periods.endTimeMinute);
      });
    }
    job.periods = periods;
  }
  if (job.default_location) job.locations = [];
  job.event = state.event.event;
  job.job_type = state.job_type;
  job.langs = state.langs.langs;
  jobSalaryFields.forEach(key => {
    job[key] = state.reward[key];
  })
  returnObject.data = job;
  return returnObject;
}

export const httpToJob = {
  rewardReducer: (job) => {
    let obj = {
      chosen: null,
      toChoose: null
    };
    jobSalaryFields.forEach(key => {
      obj[key] = job[key] || "";
    });
    if (!!job.salary_type) {
      // determine "obj.chosen"
      obj.chosen = [];
      const salaryType = salaryChoices.monetary1.reduce((result, curr) => {
        if (!!result) return result;
        if (curr.value === job.salary_type) return curr;
        return result;
      }, null);
      console.log(["salaryType", job.salary_type, salaryType]);
      obj.chosen.push(salaryType);
      // determine "obj.toChoose"
      while (salaryType.nextPointer !== null && !salaryChoices[salaryType.nextPointer].customRender) {
        obj.chosen.push(salaryChoices[salaryType.nextPointer]);
      }
      obj.toChoose = !!salaryType.nextPointer ? salaryChoices[salaryType.nextPointer] : null;
    } else {
      obj.chosen = [];
      obj.toChoose = salaryChoices.monetary1;
    }
    return obj;
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

export const getStateFromJob = (job, loading = false) => {
  const hasJob = !!job;
  const org = Reflux.GlobalState.userStore.org;
  return {
    returnToBoard: false,
    loadError: false,
    editError: null,
    loading: loading,
    job_type: hasJob ? job.job_type || null : null,
    event: {
      isEvent: hasJob ? !!job.event : false,
      event: hasJob ? job.event || "" :""
    },
    langs: {
      hasLang: hasJob ? !!job.langs && job.langs.length > 0 : false,
      langs: hasJob ? job.langs.map(lang =>  lang.code) || [] : []
    },
    job: {
      id: hasJob ? job.id : null,
      job_type: hasJob ? job.job_type || null : null,
      title: hasJob ? job.title : "",
      description: hasJob ? job.description || "" :"",
      default_location: hasJob ? job.default_location : true,
      locations: hasJob ? job.locations || [] : [],
      periods: hasJob ? job.periods || [] : [],
      employment_types: hasJob ? job.employment_types.map(et => et.name) || [] : [],
      salary_type: hasJob ? job.salary_type || "" : "",
      salary_value: hasJob ? job.salary_value || "" : "",
      salary_high: hasJob ? job.salary_high || "" : "",
      salary_low: hasJob ? job.salary_low || "" : "",
      salary_unit: hasJob ? job.salary_unit || "" : "hour",
      has_bonus: hasJob ? job.has_bonus || false : false,
      bonus_value: hasJob ? job.bonus_value || "" : "",
      attachment_url: hasJob ? job.attachment_url || [] : "",
      event: hasJob ? job.event || "" :"",
      langs: hasJob ? job.langs.map(lang =>  lang.code) || [] : []
    },
    reward: hasJob ? httpToJob.rewardReducer(job) : {
      chosen: [],
      toChoose: salaryChoices.monetary1,
      salary_type: hasJob ? job.salary_type || "" : "",
      salary_value: hasJob ? job.salary_value || "" : "",
      salary_high: hasJob ? job.salary_high || "" : "",
      salary_low: hasJob ? job.salary_low || "" : "",
      salary_unit: hasJob ? job.salary_unit || "" : "hour",
      has_bonus: hasJob ? job.has_bonus || false : false,
      bonus_value: hasJob ? job.bonus_value || "" : ""
    },
    periods: hasJob ? httpToJob.periodReducer(job.periods) : {
      dateArr: [],
      startTimeHour: "",
      startTimeMinute: "",
      endTimeHour: "",
      endTimeMinute: ""
    },
    progress: hasJob ? httpToJob.progressReducer(job) : {
      // reward: 0,
      period: 0
    },
    photo: {
      file: null,
      default: hasJob ? (org ? org.logo === job.photo : true) : true
    }
  }
}

class EditStore extends Reflux.Store {
  constructor() {
    super();
    this.state = getStateFromJob(null);
    this.listenables = EditActions;
  }

  reset() {
    this.setState(getStateFromJob());
  }

  onHttpError(errorKey, error) {
    const nextState = this.state;
    nextState.loading = false;
    nextState[errorKey] = error ? error.toString() : "";
    this.setState(nextState);
  }

  /** @param {number} id */
  loadJob(id = null) {
    if (!id) return this.setState(getStateFromJob())
    const load = () => {
      request("jobs/" + id).then(res => res.json()).then(d => {
        if (!d || !!d.errors) this.onHttpError("loadError", !!d ? d.errors : "Job is not properly loaded");
        else {
          const nextState = getStateFromJob(d, false);
          this.setState(nextState);
        }
      }).catch(err => this.onHttpError("loadError", err.toString()));
    }

    const waitToLoad = () => {
      if (!Reflux.GlobalState.userStore.org) {
        window.setTimeout(() => {
          waitToLoad()
        }, 300)
      } else {
        load();
      }
    }

    waitToLoad();
  }

  setLoading(loading = true) { this.setState({loading}); }

  save() {
    const isNew = !this.state.job.id;
    const method = isNew ? "POST" : "PATCH";
    const processData = getJobHttpObject(this.state);

    console.log(processData);
    if (!!processData.error && processData.error.length > 0) {
      const nextState = this.state;
      nextState.editError = processData.error.join("\n ");
      return this.setState(nextState);
    }
    const url = "jobs" + (isNew ? "" : "/" + processData.data.id);
    this.setState({loading: true})

    const patchJob = (patchData) => {
      request(url, method, {job: patchData.data}).then(res => res.json()).then(d => {
        console.log(d);
        if (!d) return;
        const nextState = getStateFromJob(d, false);
        nextState.returnToBoard = true;
        this.setState(nextState);
        window.setTimeout(() => this.setState({returnToBoard: false}), 150);
      });
    }

    if (this.state.photo.default) {
      processData.data.photo = "";
      patchJob(processData);
    } else {
      uploadPhoto({
        nameComponents: [
          "Companies",
          strip(Reflux.GlobalState.userStore.org.name || "default"),
          "logo",
          yyyymmddhhmmss(new Date())
        ],
        file: this.state.photo.file
      }).then(photoUrl => {
        if (!!photoUrl) processData.data.photo = photoUrl;
        else processData.data.photo = this.state.job.photo;
        patchJob(processData);
      }).catch(err => 
        this.onHttpError("editError", err.toString())
      )
    }
  }

  changeEmploymentType(value) {
    console.log("changeEmploymentType, value = " + value);
    const arr =
      (!this.state.job || !this.state.job.employment_types) ?
        [] :
        this.state.job.employment_types;
    const index = arr.indexOf(value);
    if (index === -1) arr.push(value);
    else arr.splice(index, 1);
    this.editJob("job", "employment_types", arr);
    // console.log(document.getElementById('job-employment_type').value);
  }

  /** @param {'job'|'reward'|'periods'|'locations'} objectName @param {string} value @param {'title'|'description'|'attachment_url'|'employment_type'|'salary_type'|'salary_high'|'salary_low'|'salary_value'|'has_bonus'|'bonus_value'} key */
  editJob(objectName, key, value) {
    const nextState = this.state;
    nextState[objectName][key] = value;
    nextState.loading = false;
    this.setState(nextState);
  }

  toggleEvent() {
    const nextState = this.state;
    nextState.event.isEvent = !this.state.event.isEvent;
    if (!nextState.event.isEvent) nextState.event.event = "";
    this.setState(nextState);
  }

  toggleLangs() {
    const nextState = this.state;
    nextState.langs.hasLang = !this.state.langs.hasLang;
    if (!nextState.langs.hasLang) nextState.langs.langs = [];
    this.setState(nextState);
  }

  /** @param {"add"|"remove"} addOrRemove */
  rewardChangeChoice(addOrRemove, option) {
    const nextState = this.state;
    if (addOrRemove === "add") {
      nextState.reward.toChoose = salaryChoices[option.nextPointer];
      nextState.reward.chosen.push(option);
      if (!!option.fieldName) nextState.reward[option.fieldName] = option.value;
    } else if (addOrRemove === "remove") {
      if (option.selfPointer === "monetary1") {
        nextState.reward.salary_high = ""; nextState.reward.salary_low = ""; nextState.reward.salary_value = ""; nextState.reward.salary_unit = "hour";
      }
      if (!!option.fieldName) nextState.reward[option.fieldName] = "";
      nextState.reward.toChoose = salaryChoices[option.selfPointer];
      const index = nextState.reward.chosen.indexOf(option);
      nextState.reward.chosen = nextState.reward.chosen.slice(0, index);
    }
    this.setState(nextState, () => { console.log(["choiceCmponentOnRemove, key option state", option, this.state]); });
  }

  changeJobType(jobTypeObject) {
    if (this.state.job_type !== jobTypeObject.value) {
      const nextState = this.state;
      nextState.job_type = jobTypeObject.value;
      if (nextState.job_type !== "stable" && nextState.progress.period === -1) {
        nextState.progress.period = 0;
      }
      this.setState(nextState);
    }
  }

  periodChange(periodObject = null, progress = null) {
    // console.log(["key, data, period = ", periodObject, progress]);
    const nextState = this.state;
    if (!!periodObject) {
      for (const key in periodObject) {
        nextState.periods[key] = periodObject[key];
      }
    }
    if (progress !== null && progress !== undefined) { nextState.progress.period = progress; }
    return this.setState(nextState);
  }
}

export default EditStore;
