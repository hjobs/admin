import React from 'react';
import Reflux from 'reflux';
import Flatpickr from 'react-flatpickr';
import { Button, Icon } from 'semantic-ui-react';
import { customTimeStamp } from '../../services/var';

import 'flatpickr/dist/themes/dark.css';

import TimeInput from './TimeInput';

import EditStore, { EditActions } from '../../stores/editStore';

class TimeComponent extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = EditStore;
    this.storeKeys = ["periods", "job_type", "progress"];
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = true;
    const ks = this.storeKeys;
    for (let i = 0; i < ks && shouldUpdate; i++) {
      if ( JSON.stringify(nextState[ks[i]]) !== JSON.stringify(this.state[ks[i]]) ) {
        shouldUpdate = false
      }
    }
    shouldUpdate = shouldUpdate && JSON.stringify(nextProps) === JSON.stringify(this.props);
    return shouldUpdate;
  }

  /** @param {number} progress */
  onChange(object = null, progress = null) {
    let shouldUpdate = true;
    if (!!object) {
      for (const key in object) {
        if (key === "dateArr") shouldUpdate = shouldUpdate && this.state.periods.dateArr.length !== object.dateArr.length;
      }
    } else if (progress !== null || progress !== undefined) {
      shouldUpdate = shouldUpdate && progress !== this.state.progress.period;
    }
    // shouldUpdate && this.state.period[key].length !== data.length;
    if (shouldUpdate) EditActions.periodChange(object, progress);
  }

  toggleNoDates() {
    if (this.state.progress.period === -1) {
      EditActions.periodChange(null, 0);
    } else {
      EditActions.periodChange({dateArr: [], startTimeHour: "", startTimeMinute: "", endTimeHour: "", endTimeMinute: ""}, -1);
    }
  }

  /** @return {boolean} */
  isTimeFilledIn() { const p = this.state.periods; return !!p.startTimeHour && !!p.startTimeMinute && !!p.endTimeHour && !!p.endTimeMinute; }

  renderTimeInput(id, placeholder) {
    const periods = this.state.periods;
    return (
      <TimeInput
        id={id}
        placeholder={placeholder}
        value={periods[id]}
        handleChange={val => {
          const obj = {};
          obj[id] = val;
          EditActions.periodChange(obj);
        }}
      />
    );
  }

  render() {
    const periods = this.state.periods;
    const progress = this.state.progress.period;
    return (
      <div style={{padding: "7px 0px"}}>
        <label>Dates</label>
        {
          progress !== -1 ? null :
            <div>
              <Button
                key="no-specific-date-result-button"
                size="medium"
                color="black"
                onClick={() => { this.toggleNoDates(); }}
              >
                <Icon link name="x" /> "No specific Date"
              </Button>
            </div>
        }
        {
          progress !== 0 ? null :
            <div>
              <span style={{fontSize: "12px", color: "gray"}}>Choose dates: </span>
              <div style={{width: "50%", display: "inline-block", padding: "10px"}}>
                <Flatpickr
                  options={{
                    mode: "multiple",
                    utc: true,
                    value: periods.dateArr,
                    minDate: new Date(),
                    altInput: true,
                    altFormat: "F j",
                    clickOpens: progress === 0
                  }}
                  onChange={dates => { this.onChange({dateArr: dates}); }}
                />
              </div>
              <Button
                key="no-specific-date-button"
                size="medium"
                onClick={() => { this.toggleNoDates(); }}
                disabled={this.state.job_type === "quick"}
                content={"No specific Date" + (this.state.job_type === 'quick' ? " (not applicable to quick jobs)" : "")}
              />
              <Button
                key="ok-period-1-button"
                content="ok"
                disabled={periods.dateArr.length <= 0}
                onClick={() => { if (periods.dateArr.length > 0) EditActions.periodChange(null, progress + 1); }}
              />
            </div>
        }
        {
          progress !== 1 ? null :
            <div>
              <p>
                <Button
                  key="chosen-dates-button"
                  size="medium"
                  className="chosen-bubble"
                  onClick={() => { EditActions.periodChange({dateArr: []}, progress - 1); }}
                >
                  <Icon link name="x" />
                  { periods.dateArr.map(d => customTimeStamp(d, "date")).join(", ") }
                </Button>
              </p>
              From{' '}
              {this.renderTimeInput("startTimeHour", "HH")}
              {" : "}
              {this.renderTimeInput("startTimeMinute", "MM")}
              To{' '}
              {this.renderTimeInput("endTimeHour", "HH")}
              {" : "}
              {this.renderTimeInput("endTimeMinute", "MM")}
              <Button
                content="ok"
                disabled={!this.isTimeFilledIn()}
                onClick={() => { if (this.isTimeFilledIn()) EditActions.periodChange(null, progress + 1); }}
              />
              <Button
                content="no time"
                onClick={() => { EditActions.periodChange({startTimeHour: "", startTimeMinute: "", endTimeHour: "", endTimeMinute: ""}, progress + 1); }}
              />
            </div>
        }
        {
          progress !== 2 ? null :
            <div>
              <p>
                <Button
                  key="progress-2-chosen-dates-button"
                  size="medium"
                  className="chosen-bubble"
                  onClick={() => { EditActions.periodChange({dateArr: [], startTimeHour: "", startTimeMinute: "", endTimeHour: "", endTimeMinute: ""}, progress - 2); }}
                >
                  <Icon link name="x" />
                  { periods.dateArr.map(d => customTimeStamp(d, "date")).join(", ") }
                </Button>
                <Button
                  key="progress-2-chosen-time-button"
                  size="medium"
                  className="chosen-bubble"
                  onClick={() => { EditActions.periodChange({startTimeHour: "", startTimeMinute: "", endTimeHour: "", endTimeMinute: ""}, progress - 1); }}
                >
                  <Icon link name="x" />
                  {
                    this.isTimeFilledIn() ?
                      <span>{periods.startTimeHour}:{periods.startTimeMinute} to {periods.endTimeHour}:{periods.endTimeMinute}</span>
                      :
                      "no time"
                  }
                </Button>
              </p>
            </div>
        }
      </div>
    );
  }
}

export default TimeComponent;
