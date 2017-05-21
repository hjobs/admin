import React from 'react';
import Reflux from 'reflux';
import { Form, FormGroup, FormControl, InputGroup } from 'react-bootstrap';
import { Button, Icon, Checkbox, Input } from 'semantic-ui-react';
import Themes from '../../styles/theme';

import EditStore, { EditActions } from '../../stores/editStore';

class RewardComponent extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = EditStore;
    this.storeKeys = ["reward"];
  }

  genFormGroup({key, placeholder, inputType}) {
    const reward = this.state.reward;
    return (
      <FormGroup key={key} bsSize="small" className="margin-side">
        <InputGroup>
          <InputGroup.Addon>$</InputGroup.Addon>
          <FormControl
            onChange={(event) => {
              const val = inputType === "number" ? +event.target.value : event.target.value;
              this.onChange(key, val);
            }}
            value={reward[key]}
            placeholder={placeholder}
            type={inputType}
            style={{
              fontSize: Themes.fontSizes.m,
              maxWidth: "6em",
              padding: "7px"
            }}
          />
        </InputGroup>
      </FormGroup>
    );
  }

  onChange(key, val) { EditActions.editJob("reward", key, val); }

  customRender() {
    const reward = this.state.reward;
    return (
      <Form inline>
        {
          reward.toChoose.value !== 'moneyRange' ? null :
            [
              {
                key: "salary_low",
                placeholder: "from",
                inputType: "number"
              },
              {
                key: "salary_high",
                placeholder: "to",
                inputType: "number"
              }
            ].map(context => this.genFormGroup(context))
        }
        {
          reward.toChoose.value !== "moneySpecific" ? null :
          this.genFormGroup({
            key: "salary_value",
            placeholder: "e.g. 75",
            inputType: "number"
          })
        }
        <FormGroup controlId="formControlsSelect" bsSize="small" className="margin-side">
          <FormControl
            componentClass="select"
            placeholder="select unit"
            onChange={(event) => { const val = event.target.value; this.onChange("salary_unit", val); }}
          >
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
    const reward = this.state.reward;
    return (
      <div style={{padding: "7px 0px"}}>
        <label>Salary</label>
        <div style={{padding: "5px 0px 7px 0px"}}>
          {
            reward.chosen.map(c => (
              <Button
                key={c.currentPointer + "-" + c.value}
                className="chosen-bubble"
                onClick={() => EditActions.rewardChangeChoice("remove", c)}>
                <Icon link name="x" />
                {c.name}
              </Button>
            ))
          }
        </div>
        <div>
        {
          !!reward.toChoose ? (
            !reward.toChoose.customRender ?
              reward.toChoose.map(c => (
                <Button
                  size="medium"
                  key={c.currentPointer + "-" + c.value}
                  onClick={() => EditActions.rewardChangeChoice("add", c)}
                  content={c.name} />
              )) :
              this.customRender()
          ) : null
        }
        </div>
        <div className="flex-row flex-vCenter" style={{paddingTop: "8px"}}>
          <Checkbox
            checked={reward.has_bonus === true}
            label="Has bonus"
            onChange={(e, d) => this.onChange("has_bonus", d.checked)}
          />
          {
            !reward.has_bonus ? null :
              <Input
                value={reward.bonus_value}
                onChange={(e) => this.onChange("bonus_value", event.target.value)}
                style={{
                  // marginLeft: "1em",
                  padding: 7,
                  fontSize: Themes.fontSizes.m
                }}
              />
          }
        </div>
      </div>
    );
  }
}

export default RewardComponent;
