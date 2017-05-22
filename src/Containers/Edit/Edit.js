import React from 'react';
import Reflux from 'reflux';
import { withRouter } from 'react-router-dom';
import { Button, Form, Checkbox } from 'semantic-ui-react';
// import queryString from 'query-string';
import './edit.css';

import RewardComponent from "../../Components/Edit/RewardComponent";
import TimeComponent from "../../Components/Edit/TimeComponent";
import ErrorMessage from '../../Components/Misc/ErrorMessage';
import FieldGroup from '../../Components/Edit/FieldGroup';
import fieldObjects from './EditFields';
import Event from '../../Components/Edit/Event';
import Langs from '../../Components/Edit/Langs';
import Locations from '../../Components/Misc/Locations';

import EditStore, { EditActions } from '../../stores/editStore';
import { jobType } from '../../stores/data/misc'

class Edit extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = EditStore;
    this.storeKeys = ["loading", "editError", "loadError", "job_type", "job"];
  }

  componentWillMount() {
    super.componentWillMount.call(this);
    const param = this.props.match.params.jobId;
    if (param !== "new") {
      const id = +param;
      EditActions.loadJob(id);
    } else {
      EditActions.loadJob();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.editError !== prevState.editError){
      this.scrollBottom()
    }
  }

  scrollBottom() {
    this.form.scrollTop = this.form.scrollHeight;
  }

  render() {
    if (this.state.loadError) return <ErrorMessage reason={this.state.loadError === true ? null : this.state.loadError} />

    return (
      <section className="edit-page">
        <div className="text-center" style={{marginBottom: "15px", overflowY: "scroll"}}>
          <Button.Group size="big">
          {
            jobType.reduce((result, jobType, i, arr) => {
              result.push(
                <Button
                  key={'job-type-choice-' + jobType.value}
                  onClick={() => EditActions.changeJobType(jobType)}
                  color={this.state.job_type === jobType.value ? "black" : null}
                  className={this.state.job_type === jobType.value ? null : "transparent"}
                >{jobType.name}</Button>
              );
              if (i < arr.length - 1) result.push(<Button.Or key={'button-separator-' + i} />);
              return result;
            }, [])
          }
          </Button.Group>
        </div>
        <div className="form-container" ref={el => { this.form = el; }}>
          <Form
            loading={this.state.loading}
            onSubmit={(e) => { e.preventDefault(); }}
          >
            {
              !this.state.job_type ? null :
              <div>
                {fieldObjects.map(obj => (
                  <FieldGroup
                    key={"fieldGroup-id-" + obj.key}
                    context={obj}
                  />
                ))}
                <RewardComponent />
                <TimeComponent />
                
                <label style={{marginTop: 15}}>Work Location</label>
                <Checkbox
                  checked={this.state.job.default_location}
                  label="Use my default location (can be set in your profile page)"
                  onChange={(e, d) => EditActions.editJob("job", "default_location", d.checked)}
                />
                {
                  this.state.job.default_location === true ? null :
                  <Locations
                    style={{flexGrow: 1}}
                    locations={this.state.job.locations}
                    setLoading={(loading = true) => EditActions.setLoading(loading)}
                    loading={this.state.loading}
                    placeholder={"Specify your work location"}
                    onChange={(locations) => EditActions.editJob("job", "locations", locations)}
                  />
                }
                <br /> 
                <label style={{marginTop: "15px"}}>Additional Info</label>
                <Event />
                <Langs scrollBottom={() => this.scrollBottom()} />
              </div>
            }
            {
              !!this.state.editError ?
              <ErrorMessage reason={this.state.editError} />
              :
              null
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
            onClick={() => { EditActions.save(); }} >
            Submit
          </Button>
        </div>
      </section>
    );
  }
}

export default withRouter(Edit);
