import React from 'react';
import Reflux from 'reflux';
import { withRouter } from 'react-router-dom';
import { Icon, Button, Input, TextArea, Checkbox } from 'semantic-ui-react';
import Flatpickr from 'react-flatpickr';
import clone from 'clone';
import 'flatpickr/dist/themes/dark.css';

// import EditText from './EditText';
import SaveCancel from './SaveCancel';
import UserStore, { UserActions } from '../../stores/userStore';
import TranslationStore from '../../stores/translationStore';

import { dateStamp, getEmptyJobExp } from '../../services/var';

// import { userIconTextObjects } from '../../stores/data/profile';

class ProfileJobExp extends Reflux.Component {
  constructor(props) {
    super(props);
    this.stores = [UserStore, TranslationStore];
  }

  initiateEdit(job_exp) {
    const isNew = !job_exp,
          key = 'job-exp-' + (isNew ? "new" : job_exp.id);
    job_exp = isNew ? getEmptyJobExp() : clone(job_exp);
    UserActions.editProfileItem(job_exp, key);
  }

  delete() {
    const editing = this.state.profile.editing;
    UserActions.submitProfileEdit([{
      id: editing.data.id,
      _destroy: true
    }], "job_exps");
  }

  renderDetail() {
    const t = this.state.tStrings,
          notGiven = t.profile.notGiven;
    if (!this.state.user.job_exps) return <p className="text-center">{notGiven}</p>;
    const jobExpContainerClassName = "job-exp-container"
    
    const arr = this.state.user.job_exps.map(job_exp => {
      const companyName = job_exp.company_name || (!job_exp.org ? notGiven  : job_exp.org.name);
      const timeFrom = !job_exp.time_from ? notGiven : dateStamp(new Date(job_exp.time_from));
      const timeTo = job_exp.working ? t.misc.present : (!job_exp.date_to ? notGiven : dateStamp(new Date(job_exp.date_to)));
      return (
        <div
          key={'job-exp-' + (job_exp.id || "new")}
          className={jobExpContainerClassName}
          onClick={() => this.initiateEdit(job_exp) }
        >
          <h3>{job_exp.position} <Icon className="edit-icon" name="pencil" /></h3>
          <div className="job-exp-detail-container">
            <div className="detail-company-name">{companyName}</div>
            <div className="detail-time">{timeFrom} - {timeTo}</div>
            {!job_exp.location ? null : <div className="detail-location">{job_exp.location}<br /></div>}
            {!job_exp.description ? null : <div className="detail-description">{job_exp.description}</div>}
          </div>
        </div>
      );
    });
    return arr;
  }

  editItem(key, value) {
    const editingData = this.state.profile.editing.data;
    editingData[key] = value;
    UserActions.editProfileItem(editingData);
  }

  renderEdit() {
    // const isNew = this.state.profile.editing.key === 'job-exp-new',
    const editingData = this.state.profile.editing.data,
          t = this.state.tStrings;
    const editLayoutObject = [
      {
        key: "position",
        size: "large",
        inputClassName: 'edit-position'
      },
      {
        key: "company_name"
      },
      {
        key: "time_from",
        containerClassName: 'edit-time-container half-width',
        inputType: Flatpickr,
        getEditValue: (data) => { const value = data[0]; return value; }
      },
      {
        key: "time_to",
        containerClassName: 'edit-time-container half-width',
        inputType: Flatpickr,
        getEditValue: (data) => { const value = data[0]; return value; }
      },
      {
        key: "working",
        containerClassName: "edit-working-container",
        inputSize: "mini",
        inputType: Checkbox,
        getEditValue: (event, data) => data.checked
      },
      {
        key: "location"
      },
      {
        key: "description",
        inputType: TextArea
      }
    ]
    
    return (
      <div className="job-exp-edit-container">
        {
          editLayoutObject.map(obj => {
            let containerClassName = "input-container " + (obj.containerClassName || ""),
                  inputType = obj.inputType || Input,
                  inputClassName = "full-width " + (!obj.inputClassName ? "" : " " + obj.inputClassName),
                  inputSize = obj.inputSize || "medium";
            let props = {
              className: inputClassName,
              size: inputSize,
              value: obj.getValue ? obj.getValue(editingData[obj.key]) : (editingData[obj.key] || ""),
              placeholder: t.profile.jobExp.placeholder[obj.key] || "",
              onChange: (e, d) => {
                const value = obj.getEditValue ? obj.getEditValue(e, d) : d.value;
                // console.log(["onChange", e, d]);
                this.editItem(obj.key, value);
              }
            };
            if (inputType === TextArea) { props.autoHeight = obj.autoHeight || true; }
            if (inputType === Flatpickr) {
              props.disableMobile = false;
              props.maxDate = new Date(Date.now());
            }
            if (inputType === Checkbox) {
              props.label = t.profile.jobExp.placeholder[obj.key]; props.toggle = true;
              props.checked = editingData[obj.key] === true;
              props.value = props.checked.toString();
            }
            if (obj.key === 'time_to') {
              if (!!editingData.time_from) props.minDate = new Date(editingData.time_from);
              if (editingData.working) {
                inputType = "p";
                props = {children: t.misc.present}
              }
            }

            return (
              <div className={containerClassName} key={'job-exp-edit-' + obj.key}>
                {
                  React.createElement(
                    inputType,
                    props
                  )
                }
              </div>
            );
          })
        }
        {
          this.editIsNew() ? null :
            <div className="text-center delete-container">
              <span
                className="link"
                onClick={() => this.delete()}
              >
                {t.profile.jobExp.remove}
              </span>
            </div>
        }
        
        <p className="text-red pre-line">
          {this.state.profile.errorMsg}
        </p>
        <SaveCancel />
      </div>
    )
  }

  editIsNew() { return this.state.profile.editing.key === "job-exp-new"; }

  render() {
    const t = this.state.tStrings,
          editing = /^job-exp-/.test(this.state.profile.editing.key);
    return (
      <div className="job-exps-container">
        <h4 className="text-center"><Icon name="briefcase"/> {t.profile.jobExperience}</h4>
        <div style={{padding: "15px 0px"}}>
          {
            /*
              job-exp edit state is determined by
              (profile.editing.key === 'job-exp-' + job_exps array index) --- in the case of existing job_exp
              (profile.editing.key === 'job-exp-new') --- in the case of newly created one
            */
            editing ?
              this.renderEdit() :
              this.renderDetail()
          }
        </div>
        {
          editing ? null :
            <div className="text-center">
              <Button
                color="green"
                size="large"
                icon
                style={{minWidth: "100px"}}
                onClick={() => this.initiateEdit()}
                content={<Icon name="plus" />}
              />
            </div>
        }
      </div>
    );
  }
}

export default withRouter(ProfileJobExp);
