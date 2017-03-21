import React from 'react';
import { Modal, FormGroup, ControlLabel, HelpBlock, FormControl, Checkbox } from 'react-bootstrap';
import { Button } from 'semantic-ui-react';
// import { Modal } from 'react-bootstrap';
import 'whatwg-fetch';

import Variable from '../../services/var';
import Http from '../../services/http';

import ChoiceComponent from "./ChoiceComponent";

class AddItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.vars = new Variable();
    this.http = new Http();
    this.state = {
      job: {
        title: "",
        description: "",
        attachment_url: "",
        employment_type: [],
        job_type: props.jobType || "quick",
        salary_type: "",
        salary_value: "",
        salary_high: "",
        salary_low: ""
      },
      reward: {
        chosen: [],
        toChoose: this.vars.salaryChoices.root
      },
      loading: false
    };
  }

  /*
  attachment_url
  deadline: datetime
  description: text
  job_type: integer
  position: string

  reward_type (salary_type: string)
  reward_high (salary_high: integer)
  reward_low (salary_low: integer)
  reward_value (salary_value: text)
  */

  save() {
    this.setState(s => { s.loading = true; }, () => {
      this.http.request('jobs', "POST", {jobs: this.state.job}).then(res => {
        console.log(res);
        if (!res.ok) return this.setState(s => { s.loading = false; s.errorMessage = res.statusText; return s; });
        return res.json();
      })
      .then(d => {
        if (!d) return;
        this.setState(s => { s.loading = false; s.errorMessage = null; return s; }, () => {
          this.props.closeModal(true);
        });
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

  choiceComponentOnAdd(key, option) {
    this.setState(s => {
      s[key].toChoose = this.vars.salaryChoices[option.nextPointer];
      s[key].chosen.push(option);
    });
  }

  choiceComponentOnRemove(key, option) {
    this.setState(s => {
      s[key].toChoose = this.vars.salaryChoices[option.selfPointer];
      const index = s[key].chosen.indexOf(option);
      s[key].chosen = s[key].chosen.slice(0, index);
      return s;
    }, () => { console.log(["choiceCOmponentOnRemove, key option state", key, option, this.state]); });
  }

  changeJobType(jobTypeObject) {
    if (this.state.job.job_type !== jobTypeObject.value) {
      this.setState(s => { s.job.job_type = jobTypeObject.value; return s; });
    }
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

    const checkbox = ({id, label, help, itemArr}) => {
      return (
        <FormGroup>
          { label ? <ControlLabel>{label}</ControlLabel> : null }
          {' '}
          {
            itemArr.map(item =>
              <Checkbox
                key={"job" + "_" + id + "_" + item.value}
                onClick={() => { this.changeEmploymentType(item.value); }} inline>
                {item.name} {' '}
              </Checkbox>
            )
          }
          {help}
        </FormGroup>
      );
    };

    return (
      <Modal show={this.props.show} dialogClassName="addItemModal" keyboard={false} backdrop="static">
        <Modal.Body>
          <div className="text-center" style={{marginBottom: "15px"}}>
            <Button.Group size="big">
            {
              this.vars.jobType.reduce((result, jobType, i, arr) => {
                result.push(
                  <Button
                    onClick={() => { this.changeJobType(jobType); }}
                    color={this.state.job.job_type === jobType.value ? "black" : "transparent"}
                  >{jobType.name}</Button>
                );
                if (i < arr.length - 1) result.push(<Button.Or />);
                return result;
              }, [])
            }
            </Button.Group>
          </div>
          {fieldGroup({
            id: "title",
            label: "Job Title",
            type: "text",
            placeholder: "e.g. Bartender, quick help on special event"
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
          <ChoiceComponent
            addChoice={(option) => { this.choiceComponentOnAdd("reward", option); }}
            removeChoice={(option) => { this.choiceComponentOnRemove("reward", option); }}
            choicesChosen={this.state.reward.chosen}
            choicesToChoose={this.state.reward.toChoose}
          />
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

AddItemModal.propTypes = {
  closeModal: React.PropTypes.func.isRequired,
  show: React.PropTypes.bool.isRequired,
  jobType: React.PropTypes.string
};

export default AddItemModal;
