import React from 'react';
// import Reflux from 'reflux';
import { withRouter } from 'react-router-dom';
import { Button, Checkbox, Dropdown, Form } from 'semantic-ui-react';
// import queryString from 'query-string';

import Variable from '../../services/var';
import Http from '../../services/http';

import RewardComponent from "../../Components/Edit/RewardComponent";
import TimeComponent from "../../Components/Edit/TimeComponent";
// import Loading from '../../Components/Misc/Loading';
import ErrorMessage from '../../Components/Misc/ErrorMessage';
import FieldGroup from '../../Components/Edit/FieldGroup';
import fieldObjects from './EditFields';
import { langObjects } from '../../stores/data/misc'

class Edit extends React.Component {
  constructor(props) {
    super(props);

    // determine whether it's new or edit existing job
    const param = props.match.params.jobId;
    this.state = Variable.getStateFromJob(null, param !== "new");
    if (param !== "new") {
      const id = +param;
      if (typeof id !== "number") props.history.replace("/board?error=Job%20Not%20Found");
      else this.loadJob(id);
    }
  }

  /** @param {number} id */
  loadJob(id) {
    const onError = (err) => {
      console.log(err);
      this.setState(s => {
        s.jobModal.loading = false;
        s.error = err || true;
        return s;
      })
    }

    Http.request("jobs/" + id, "GET")
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(d => {
      if (!d || !!d.error) {
        onError(d.toStrig());
      } else {
        this.setState(s => {
          s = Variable.getStateFromJob(d, false);
          return s;
        })
      }
    }).catch(err => onError(err.toString()));
  }

  save() {
    const method = this.props.match.params.jobId === "new" ? "POST" : "PATCH";
    const processData = Variable.getJobHttpObject(this.state.jobModal);
    console.log(processData);
    if (!!processData.error && processData.error.length > 0) {
      return this.setState(s => {
        s.jobModal.errorMessage = processData.error.join("\n ");
        return s;
      }, () => this.scrollToBottom());
    }
    const url = "jobs" + (method === "PATCH" ? "/" + processData.data.id : "");

    return this.setState(s => { s.loading = true; }, () => {
      Http.request(url, method, {job: processData.data}).then(res => {
        console.log(res);
        if (!res.ok) return this.setState(s => { s.jobModal.loading = false; s.jobModal.errorMessage = res.statusText; return s; });
        return res.json();
      }).then(d => {
        if (!d) return;
        this.setState(() => Variable.getStateFromJob(null, false), () => { this.props.history.push("/board"); });
      });
    });
  }

  scrollToBottom() {
    this.form.scrollTop = this.form.scrollHeight;
  }

  changeEmploymentType(value) {
    console.log("changeEmploymentType, valu = " + value);
    const arr =
      (!this.state.jobModal.job || !this.state.jobModal.job.employment_types) ?
        [] :
        this.state.jobModal.job.employment_types;
    const index = arr.indexOf(value);
    if (index === -1) arr.push(value);
    else arr.splice(index, 1);
    this.handleFormChange("employment_types", arr);
    // console.log(document.getElementById('job-employment_type').value);
  }

  /** @param {string} value @param {'title'|'description'|'attachment_url'|'employment_type'|'salary_type'|'salary_high'|'salary_low'|'salary_value'|'has_bonus'|'bonus_value'} key */
  handleFormChange(key, value) {
    this.setState(s => {
      s.jobModal.job[key] = value;
      return s;
    });
  }

  /** @param {"add"|"remove"} addOrRemove */
  rewardChangeChoice(addOrRemove, option) {
    this.setState(s => {
      if (addOrRemove === "add") {
        s.jobModal.reward.toChoose = Variable.salaryChoices[option.nextPointer];
        s.jobModal.reward.chosen.push(option);
        if (!!option.fieldName) s.jobModal.job[option.fieldName] = option.value;
      } else if (addOrRemove === "remove") {
        if (option.selfPointer === "monetary1") {
          s.jobModal.job.salary_high = ""; s.jobModal.job.salary_low = ""; s.jobModal.job.salary_value = ""; s.jobModal.job.salary_unit = "hour";
        }
        if (!!option.fieldName) s.jobModal.job[option.fieldName] = "";
        s.jobModal.reward.toChoose = Variable.salaryChoices[option.selfPointer];
        const index = s.jobModal.reward.chosen.indexOf(option);
        s.jobModal.reward.chosen = s.jobModal.reward.chosen.slice(0, index);
      }
      return s;
    }, () => { console.log(["choiceCmponentOnRemove, key option state", option, this.state]); });
  }

  changeJobType(jobTypeObject) {
    if (this.state.jobModal.job.job_type !== jobTypeObject.value) {
      this.setState(s => {
        s.jobModal.job.job_type = jobTypeObject.value;
        if (s.jobModal.job.job_type !== "stable" && s.jobModal.progress.period === -1) {
          s.jobModal.progress.period = 0;
        }
        return s;
      });
    }
  }

  periodChange(periodObject = null, progress = null) {
    console.log(["key, data, period = ", periodObject, progress]);
    // if (key === "reset") return this.setState(s => { s.period = {dateArr: [], startTimeHour: "", startTimeMinute: "", endTimeHour: "", endTimeMinute: ""}; s.progress.period = 0; return s; });
    return this.setState(s => {
      if (!!periodObject) {
        for (const key in periodObject) {
          s.jobModal.period[key] = periodObject[key];
        }
      }
      if (progress !== null && progress !== undefined) { s.jobModal.progress.period = progress; }
      return s;
    }, () => console.log(this.state));
  }

  render() {
    if (this.state.error) return <ErrorMessage reason={this.state.error === true ? null : this.state.error} />

    return (
      <section className="edit-page">
        <div className="form-container" ref={el => { this.form = el; }}>
          <Form
            loading={this.state.jobModal.loading}
            onSubmit={(e) => { e.preventDefault(); }}
          >
            {/* <Prompt when={true} message="All changes will be lost" /> */}
            <div className="text-center" style={{marginBottom: "15px"}}>
              <Button.Group size="big">
              {
                Variable.jobType.reduce((result, jobType, i, arr) => {
                  result.push(
                    <Button
                      key={'job-type-choice-' + jobType.value}
                      onClick={() => { this.changeJobType(jobType); }}
                      color={this.state.jobModal.job.job_type === jobType.value ? "black" : null}
                      className={this.state.jobModal.job.job_type === jobType.value ? null : "transparent"}
                    >{jobType.name}</Button>
                  );
                  if (i < arr.length - 1) result.push(<Button.Or key={'button-separator-' + i} />);
                  return result;
                }, [])
              }
              </Button.Group>
            </div>
            {
              !this.state.jobModal.job.job_type ? null :
              <div>
                {fieldObjects.map(obj => (
                  <FieldGroup
                    key={"fieldGroup-id-" + obj.id}
                    id={obj.id}
                    label={obj.label}
                    type={obj.type}
                    placeholde={obj.placeholder}
                    value={this.state.jobModal.job[obj.id]}
                    handleFormChange={(value) => { this.handleFormChange(obj.id, value); }}
                  />
                ))}
                <RewardComponent
                  onChangeChoice={(addOrRemove, option) => { this.rewardChangeChoice(addOrRemove, option); }}
                  onChangeInput={(key, data) => { this.handleFormChange(key, data); }}
                  choicesChosen={this.state.jobModal.reward.chosen}
                  choicesToChoose={this.state.jobModal.reward.toChoose}
                  customData={this.state.jobModal.job}
                  progress={this.state.jobModal.progress.reward}
                />
                <TimeComponent
                  jobType={this.state.jobModal.job.job_type}
                  type="period"
                  setDate={() => {}}
                  onChange={(key, data, period) => { this.periodChange(key, data, period); }}
                  data={this.state.jobModal.period}
                  progress={this.state.jobModal.progress.period}
                />
                <label style={{marginTop: "15px"}}>Additional Info</label>
                <div className="flex-row flex-vCenter">
                  <Checkbox
                    checked={this.state.jobModal.isEvent}
                    label="this is an event"
                    onClick={() => { this.setState(s => {
                      s.jobModal.isEvent = !this.state.jobModal.isEvent;
                      if (!s.isEvent) s.jobModal.job.event = "";
                      return s;
                    }); }}
                  /><span style={{visibility: "hidden"}}>"a"</span>
                  {
                    !this.state.jobModal.isEvent ? null :
                      <input
                        style={{display: "inline-block", width: "20rem"}}
                        value={this.state.jobModal.job.event}
                        maxLength={20}
                        onChange={() => { this.setState(s => { s.jobModal.job.event = event.target.value; }); }}
                        placeholder="Event name here"
                      />
                  }
                </div>
                <div style={{fontSize: "12px"}}>
                  <Checkbox
                    checked={this.state.jobModal.hasLang}
                    label="has language requirement"
                    onClick={() => { this.setState(s => {
                      s.jobModal.hasLang = !this.state.jobModal.hasLang;
                      if (!s.jobModal.isEvent) s.jobModal.job.langs = [];
                      return s;
                    }); }}
                  /><span style={{visibility: "hidden"}}>"a"</span>
                  {
                    !this.state.jobModal.hasLang ? null :
                      <Dropdown
                        multiple
                        placeholder="choose here"
                        pointing="bottom"
                        onClick={() => {
                          this.form.scrollTop = this.form.scrollHeight;
                        }}
                        onChange={(e, data) => {
                          this.setState(s => {
                            s.jobModal.job.langs = data.value;
                            return s;
                          });
                        }}
                        value={this.state.jobModal.job.langs}
                        options={langObjects}
                      />
                  }
                </div>
              </div>
            }
            {
              !!this.state.jobModal.errorMessage ? <ErrorMessage reason={this.state.jobModal.errorMessage} /> : null
            }
          </Form>
        </div>
        <div className="flex-row flex-vhCenter bottom-bar full-width">
          <Button
            color="orange"
            onClick={() => { this.props.history.push('/board'); }} >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={() => { this.save(); }} >
            Submit
          </Button>
        </div>
      </section>
    );
  }
}

export default withRouter(Edit);
