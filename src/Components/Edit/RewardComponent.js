import React from 'react';
import { Form, FormGroup, FormControl, InputGroup } from 'react-bootstrap';
import { Button, Icon, Checkbox, Input } from 'semantic-ui-react';

import FieldGroup from './FieldGroup';
// import Variable from '../../services/var';

class RewardComponent extends React.Component {

  customRender() {
    const job = this.props.customData;
    return (
      <Form inline>
        {
          this.props.choicesToChoose.value !== 'moneyRange' ? null :
            [
              <FormGroup key="salary_low" bsSize="small" className="margin-side">
                <InputGroup>
                  <InputGroup.Addon>$</InputGroup.Addon>
                  <FormControl
                    onChange={(event) => { this.props.onChangeInput("salary_low", event.target.value); }}
                    value={job.salary_low}
                    placeholder="from"
                    type="number" />
                </InputGroup>
              </FormGroup>,
              <FormGroup key="salary_high" bsSize="small" className="margin-side">
                <InputGroup>
                  <InputGroup.Addon>$</InputGroup.Addon>
                  <FormControl
                    onChange={(event) => { this.props.onChangeInput("salary_high", event.target.value); }}
                    value={job.salary_high}
                    placeholder="to"
                    type="number" />
                </InputGroup>
              </FormGroup>
            ]
        }
        {
          this.props.choicesToChoose.value !== "moneySpecific" ? null :
            <FormGroup bsSize="small" className="margin-side">
              <InputGroup>
                <InputGroup.Addon>$</InputGroup.Addon>
                <FormControl
                  onChange={(event) => { this.props.onChangeInput("salary_value", event.target.value); }}
                  value={job.salary_value}
                  type="number" />
              </InputGroup>
            </FormGroup>
        }
        <FormGroup controlId="formControlsSelect" bsSize="small" className="margin-side">
          <FormControl componentClass="select" placeholder="select unit" onChange={(event) => { this.props.onChangeInput("salary_unit", event.target.value); }}>
            <option value="hour">/hour</option>
            <option value="day">/day</option>
            <option value="month">/month</option>
            <option value="year">/year</option>
          </FormControl>
        </FormGroup>
      </Form>
    );
  }

  render() {
    const job = this.props.customData;
    return (
      <div style={{padding: "7px 0px"}}>
        <label>Reward</label>
        <div style={{padding: "5px 0px 7px 0px"}}>
          {
            this.props.choicesChosen.map(c => (
              <Button
                key={c.currentPointer + "-" + c.value}
                className="chosen-bubble"
                onClick={() => { this.props.onChangeChoice("remove", c); }}>
                <Icon link name="x" />
                {c.name}
              </Button>
            ))
          }
        </div>
        <div>
        {
          !!this.props.choicesToChoose ? (
            !this.props.choicesToChoose.customRender ?
              this.props.choicesToChoose.map(c => (
                <Button
                  size="medium"
                  key={c.currentPointer + "-" + c.value}
                  onClick={() => { this.props.onChangeChoice("add", c); }}
                  content={c.name} />
              )) :
              this.customRender()
          ) : null
        }
        </div>
        <div className="flex-row flex-vCenter" style={{paddingTop: "8px"}}>
          <Checkbox
            checked={job.has_bonus}
            label="Has bonus"
            onChange={(e, d) => this.props.onChangeInput("has_bonus", d.checked)}
          />
          {
            !job.has_bonus ? null :
              <Input
                style={{marginLeft: "1em"}}
                value={job.bonus_value}
                onChange={(e, d) => this.props.onChangeInput("bonus_value", d.value)}
              />
          }
        </div>
      </div>
    );
  }
}

RewardComponent.propTypes = {
  onChangeChoice: React.PropTypes.func.isRequired,
  onChangeInput: React.PropTypes.func.isRequired,
  choicesChosen: React.PropTypes.any,
  choicesToChoose: React.PropTypes.any,
  customData: React.PropTypes.any
};

export default RewardComponent;
