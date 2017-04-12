import React from 'react';
import Flatpickr from 'react-flatpickr';
import { Button, Icon } from 'semantic-ui-react';
import Variable from '../../services/var';

class TimeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.vars = new Variable();
  }

  onChange(object = null, num = null) {
    let shouldUpdate = true;
    if (!!object) {
      for (const key in object) {
        if (key === "dateArr") shouldUpdate = shouldUpdate && this.props.data.dateArr.length !== object.dateArr.length;
      }
    } else if (num !== null || num !== undefined) {
      shouldUpdate = shouldUpdate && num !== this.props.progress;
    }
    // shouldUpdate && this.state.period[key].length !== data.length;
    if (shouldUpdate) this.props.onChange(object, num);
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

  render() {
    const dataObj = !this.props.data ? null : this.props.data;
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
                    value: dataObj.dateArr,
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
                disabled={dataObj.dateArr.length <= 0}
                onClick={() => { if (dataObj.dateArr.length > 0) this.onChange(null, progress + 1); }}
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
                  { dataObj.dateArr.map(d => this.vars.customTimeStamp(d, "date")).join(", ") }
                </Button>
              </p>
              From{' '}
              <input
                type="number"
                placeholder="HH"
                className="time-input"
                value={dataObj.startTimeHour}
                onChange={event => { this.onChange({startTimeHour: event.target.value}); }}
              />{" : "}
              <input
                type="number"
                placeholder="MM"
                className="time-input"
                value={dataObj.startTimeMinute}
                onChange={event => { this.onChange({startTimeMinute: event.target.value}); }}
              />
              To{' '}
              <input
                type="number"
                placeholder="HH"
                className="time-input"
                value={dataObj.endTimeHour}
                onChange={event => { this.onChange({endTimeHour: event.target.value}); }}
              />{" : "}
              <input
                type="number"
                placeholder="MM"
                className="time-input"
                value={dataObj.endTimeMinute}
                onChange={event => { this.onChange({endTimeMinute: event.target.value}); }}
              />
              <Button
                key="ok-time-button"
                content="ok"
                disabled={!this.isTimeFilledIn()}
                onClick={() => { if (this.isTimeFilledIn()) this.onChange(null, progress + 1); }}
              />
              <Button
                key="no-time-button"
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
                  { dataObj.dateArr.map(d => this.vars.customTimeStamp(d, "date")).join(", ") }
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
                      <span>{dataObj.startTimeHour}:{dataObj.startTimeMinute} to {dataObj.endTimeHour}:{dataObj.endTimeMinute}</span>
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
