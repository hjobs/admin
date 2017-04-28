import React from 'react';
import Reflux from 'reflux';
import Flatpickr from 'react-flatpickr';
import { Button, Icon } from 'semantic-ui-react';
import Variable from '../../services/var';

// import 'flatpickr/dist/flatpick.min.css';
import 'flatpickr/dist/themes/dark.css';

import TimeInput from './TimeInput';

class TimeComponent extends Reflux.Component {

  /** @param {number} progress */
  onChange(object = null, progress = null) {
    let shouldUpdate = true;
    if (!!object) {
      for (const key in object) {
        if (key === "dateArr") shouldUpdate = shouldUpdate && this.props.data.dateArr.length !== object.dateArr.length;
      }
    } else if (progress !== null || progress !== undefined) {
      shouldUpdate = shouldUpdate && progress !== this.props.progress;
    }
    // shouldUpdate && this.state.period[key].length !== data.length;
    if (shouldUpdate) this.props.onChange(object, progress);
  }

  toggleNoDates() {
    if (this.props.progress === -1) {
      this.props.onChange(null, 0);
    } else {
      this.props.onChange({dateArr: [], startTimeHour: "", startTimeMinute: "", endTimeHour: "", endTimeMinute: ""}, -1);
    }
  }

  // /** @param {"add"|"set"} addOrSet @param {number?} num */
  // changeProgress(addOrSet, num = null) {
  //   if (addOrSet === "add") {
  //     this.props.onChange(null, this.props.progress + num);
  //   } else if (addOrSet === "set") {
  //     this.props.onChange(null, num);
  //   }
  // }

  /** @return {boolean} */
  isTimeFilledIn() { const p = this.props.data; return !!p.startTimeHour && !!p.startTimeMinute && !!p.endTimeHour && !!p.endTimeMinute; }

  renderTimeInput(id, placeholder) {
    // const max = Variable.getTimeInputMax(id, this.props.data);
    return (
      <TimeInput
        id={id}
        placeholder={placeholder}
        value={this.props.data[id]}
        handleChange={val => {
          const obj = {};
          obj[id] = val;
          this.onChange(obj);
        }}
      />
    );
  }

  render() {
    const periodProp = !this.props.data ? null : this.props.data;
    const progress = this.props.progress;
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
                    value: periodProp.dateArr,
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
                disabled={this.props.jobType === "quick"}
                content={"No specific Date" + (this.props.jobType === 'quick' ? " (not applicable to quick jobs)" : "")}
              />
              <Button
                key="ok-period-1-button"
                content="ok"
                disabled={periodProp.dateArr.length <= 0}
                onClick={() => { if (periodProp.dateArr.length > 0) this.onChange(null, progress + 1); }}
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
                  onClick={() => { this.onChange({dateArr: []}, progress - 1); }}
                >
                  <Icon link name="x" />
                  { periodProp.dateArr.map(d => Variable.customTimeStamp(d, "date")).join(", ") }
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
                onClick={() => { if (this.isTimeFilledIn()) this.onChange(null, progress + 1); }}
              />
              <Button
                content="no time"
                onClick={() => { this.onChange({startTimeHour: "", startTimeMinute: "", endTimeHour: "", endTimeMinute: ""}, progress + 1); }}
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
                  onClick={() => { this.onChange({dateArr: [], startTimeHour: "", startTimeMinute: "", endTimeHour: "", endTimeMinute: ""}, progress - 2); }}
                >
                  <Icon link name="x" />
                  { periodProp.dateArr.map(d => Variable.customTimeStamp(d, "date")).join(", ") }
                </Button>
                <Button
                  key="progress-2-chosen-time-button"
                  size="medium"
                  className="chosen-bubble"
                  onClick={() => { this.onChange({startTimeHour: "", startTimeMinute: "", endTimeHour: "", endTimeMinute: ""}, progress - 1); }}
                >
                  <Icon link name="x" />
                  {
                    this.isTimeFilledIn() ?
                      <span>{periodProp.startTimeHour}:{periodProp.startTimeMinute} to {periodProp.endTimeHour}:{periodProp.endTimeMinute}</span>
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

TimeComponent.propTypes = {
  jobType: React.PropTypes.string,
  type: React.PropTypes.string.isRequired, // unused
  onChange: React.PropTypes.func.isRequired,
  noDates: React.PropTypes.func,
  data: React.PropTypes.any.isRequired,
  progress: React.PropTypes.number.isRequired
};

export default TimeComponent;
