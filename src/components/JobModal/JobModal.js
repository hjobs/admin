import React from 'react';
import { Modal, FormGroup, ControlLabel, HelpBlock, FormControl } from 'react-bootstrap';
import { Button, Checkbox, Input, Dropdown } from 'semantic-ui-react';
// import { Modal } from 'react-bootstrap';
import 'whatwg-fetch';

import Variable from '../../services/var';
import Http from '../../services/http';

import RewardComponent from "./RewardComponent";
import TimeComponent from "./TimeComponent";

class JobModal extends React.Component {
  constructor(props) {
    super(props);
    this.vars = new Variable();
    this.http = new Http();
    this.state = this.getBlankState();
  }

  getBlankState() {
    return {
      job: {
        title: "",
        description: "",
        event: "",
        langs: [],
        attachment_url: "",
        employment_types: [],
        job_type: "quick",
        salary_type: "",
        salary_value: "",
        salary_high: "",
        salary_low: "",
        salary_unit: "hour"
      },
      reward: {
        chosen: [],
        toChoose: this.vars.salaryChoices.monetary1
      },
      period: {
        dateArr: [],
        startTimeHour: "",
        startTimeMinute: "",
        endTimeHour: "",
        endTimeMinute: ""
      },
      progress: {
        // reward: 0,
        period: 0
      },
      isEvent: false,
      hasLang: false,
      loading: false,
      errorMessage: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show !== this.props.show && !!nextProps.data) {
      const j = nextProps.data;
      this.setState(s => {
        s.job = {
          title: j.title,
          description: j.description,
          event: j.event,
          langs: [],
          attachment_url: "",
          employment_types: [],
          job_type: "quick",
          salary_type: "",
          salary_value: "",
          salary_high: "",
          salary_low: "",
          salary_unit: "hour"
        };
      });
    } else if (nextProps.show !== this.props.show && !nextProps.data) {
      this.setState(() => this.getBlankState());
    }
  }

  save() {
    const method = this.props.type === "new" ? "POST" : "PATCH";
    const processData = this.vars.getJobHttpObject(this.state);
    console.log(processData);
    if (!!processData.error && processData.error.length > 0) {
      return this.setState(s => { s.errorMessage = processData.error.join("\n "); return s; });
    }
    return this.setState(s => { s.loading = true; }, () => {
      this.http.request('jobs', method, {job: processData.data}).then(res => {
        console.log(res);
        if (!res.ok) return this.setState(s => { s.loading = false; s.errorMessage = res.statusText; return s; });
        return res.json();
      }).then(d => {
        if (!d) return;
        this.setState(() => this.getBlankState(), () => { this.props.closeModal(true); });
      });
    });
  }

  changeEmploymentType(value) {
    console.log("changeEmploymentType, valu = " + value);
    const arr =
      (!this.state.job || !this.state.job.employment_types) ?
        [] :
        this.state.job.employment_types;
    const index = arr.indexOf(value);
    if (index === -1) arr.push(value);
    else arr.splice(index,1);
    this.handleFormChange("employment_types", arr);
    // console.log(document.getElementById('job-employment_type').value);
  }

  /** @param {string} value @param {'title'|'description'|'attachment_url'|'employment_type'|'salary_type'|'salary_high'|'salary_low'|'salary_value'} key */
  handleFormChange(key, value) {
    this.setState(s => {
      s.job[key] = value;
      return s;
    });
  }

  /** @param {"add"|"remove"} addOrRemove */
  rewardChangeChoice(addOrRemove, option) {
    this.setState(s => {
      if (addOrRemove === "add") {
        s.reward.toChoose = this.vars.salaryChoices[option.nextPointer];
        s.reward.chosen.push(option);
        if (!!option.fieldName) s.job[option.fieldName] = option.value;
      } else if (addOrRemove === "remove") {
        if (option.selfPointer === "monetary1") {
          s.job.salary_high = ""; s.job.salary_low = ""; s.job.salary_value = ""; s.job.salary_unit = "hour";
        }
        if (!!option.fieldName) s.job[option.fieldName] = "";
        s.reward.toChoose = this.vars.salaryChoices[option.selfPointer];
        const index = s.reward.chosen.indexOf(option);
        s.reward.chosen = s.reward.chosen.slice(0, index);
      }
      return s;
    }, () => { console.log(["choiceCOmponentOnRemove, key option state", option, this.state]); });
  }

  changeJobType(jobTypeObject) {
    if (this.state.job.job_type !== jobTypeObject.value) {
      this.setState(s => {
        s.job.job_type = jobTypeObject.value;
        if (s.job.job_type !== "stable" && s.progress.period === -1) {
          s.progress.period = 0;
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
          s.period[key] = periodObject[key];
        }
      }
      if (progress !== null && progress !== undefined) { s.progress.period = progress; }
      return s;
    }, () => console.log(this.state));
  }

  render() {
    if (!this.props.show) return null;
    const fieldGroup = ({id, label, help, type, placeholder, props}) => {
      let value = this.state.job[id];
      return (
        <FormGroup controlId={id}>
          {!label ? null : <ControlLabel>{label}</ControlLabel>}
          {
            type !== "textarea" ?
              <FormControl
                value={value}
                {...props}
                placeholder={placeholder}
                type={type}
                onChange={(event) => { this.handleFormChange(id, event.target.value); }}
              />
              :
              <FormControl
                componentClass={type}
                value={value}
                placeholder={placeholder}
                onChange={(event) => { this.handleFormChange(id, event.target.value); }}
              />
          }
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
      );
    };

    // const checkbox = ({id, label, help, itemArr}) => {
    //   return (
    //     <FormGroup>
    //       { label ? <ControlLabel>{label}</ControlLabel> : null }
    //       {' '}
    //       {
    //         itemArr.map(item =>
    //           <Checkbox
    //             key={"job" + "_" + id + "_" + item.value}
    //             onClick={() => { this.changeEmploymentType(item.value); }} inline>
    //             {item.name} {' '}
    //           </Checkbox>
    //         )
    //       }
    //       {help}
    //     </FormGroup>
    //   );
    // };

    return (
      <Modal show={this.props.show} dialogClassName="jobModal" keyboard={false} backdrop="static">
        <Modal.Body>
          <div className="text-center" style={{marginBottom: "15px"}}>
            <Button.Group size="big">
            {
              this.vars.jobType.reduce((result, jobType, i, arr) => {
                result.push(
                  <Button
                    key={'job-type-choice-' + jobType.value}
                    onClick={() => { this.changeJobType(jobType); }}
                    color={this.state.job.job_type === jobType.value ? "black" : null}
                    className={this.state.job.job_type === jobType.value ? null : "transparent"}
                  >{jobType.name}</Button>
                );
                if (i < arr.length - 1) result.push(<Button.Or key={'button-separator-' + i} />);
                return result;
              }, [])
            }
            </Button.Group>
          </div>
          {fieldGroup({
            id: "title",
            label: "Job Title",
            type: "text",
            placeholder: "e.g. Bartender"
          })}
          { fieldGroup({
            id: "description",
            label: "Description",
            type: "textarea",
            placeholder: "Get creative!"
          })}
          { fieldGroup({
            id: "attachment_url",
            label: "Attachment Link (Dropbox)",
            type: "text",
            placeholder: "e.g. https://www.dropbox.com/s/mv7h76ivci2/VTafwn.pdf?dl=0"
          })}
          <RewardComponent
            onChangeChoice={(addOrRemove, option) => { this.rewardChangeChoice(addOrRemove, option); }}
            onChangeInput={(key, data) => { this.handleFormChange(key, data); }}
            choicesChosen={this.state.reward.chosen}
            choicesToChoose={this.state.reward.toChoose}
            customData={this.state.job}
            progress={this.state.progress.reward}
          />
          <TimeComponent
            jobType={this.state.job.job_type}
            type="period"
            setDate={() => {}}
            onChange={(key, data, period) => { this.periodChange(key, data, period); }}
            data={this.state.period}
            progress={this.state.progress.period}
          />
          <label style={{marginTop: "15px"}}>Additional Info</label>
          <div>
            <Checkbox
              checked={this.state.isEvent}
              label="this is an event"
              onClick={() => { this.setState(s => {
                s.isEvent = !this.state.isEvent;
                if (!s.isEvent) s.job.event = "";
                return s;
              }); }}
            /><span style={{visibility: "hidden"}}>"a"</span>
            {
              !this.state.isEvent ? null :
                <input
                  value={this.state.job.event}
                  onChange={() => { this.setState(s => { s.job.event = event.target.value; }); }}
                  placeholder="Event name here"
                />
            }
          </div>
          <div style={{fontSize: "12px"}}>
            <Checkbox
              checked={this.state.hasLang}
              label="has language requirement"
              onClick={() => { this.setState(s => {
                s.hasLang = !this.state.hasLang;
                if (!s.isEvent) s.job.langs = [];
                return s;
              }); }}
            /><span style={{visibility: "hidden"}}>"a"</span>
            {
              !this.state.hasLang ? null :
                <Dropdown
                  multiple
                  placeholder="choose here"
                  onChange={(e, data) => {
                    this.setState(s => {
                      s.job.langs = data.value;
                      return s;
                    });
                  }}
                  options={[
                    {key: "english", text: "English", value: "english"},
                    {key: "cantonese", text: "Cantonese", value: "cantonese"},
                    {key: "mandarin", text: "Mandarin", value: "mandarin"}
                  ]}
                />
            }
          </div>
          <p style={{color: "red", whiteSpace: "pre-line", textAlign: "center", fontSize: "12px", paddingTop: "14px"}}>
            {this.state.errorMessage}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="orange"
            onClick={() => { this.props.closeModal(false); }} >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={() => { this.save(); }} >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

JobModal.propTypes = {
  closeModal: React.PropTypes.func.isRequired,
  type: React.PropTypes.string.isRequired,
  show: React.PropTypes.bool.isRequired,
  data: React.PropTypes.any
};

export default JobModal;
