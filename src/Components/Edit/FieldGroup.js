import React from 'react';
import Reflux from 'reflux';
import { FormGroup, ControlLabel, HelpBlock, FormControl } from 'react-bootstrap';

import EditStore, { EditActions } from '../../stores/editStore';

class FieldGroup extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = EditStore;
    this.storeKeys = ["job"];
  }

  handleChange(val) {
    EditActions.editJob("job", this.props.context.key, val);
  }

  render() {
    const job = this.state.job;
    const { context } = this.props;
    return (
      <FormGroup style={context.inline ? {display: "inline-block"} : null} controlId={context.key}>
        {!context.label ? null : <ControlLabel>{context.label}</ControlLabel>}
        {
          context.inputType !== "textarea" ?
            <FormControl
              value={job[context.key]}
              placeholder={context.placeholder}
              type={context.inputType || "text"}
              onKeyDown={(evt) => { if (evt.keyCode === 13) evt.preventDefault(); }}
              onChange={(event) => { const val = event.target.value; this.handleChange(val); }}
            />
            :
            <FormControl
              componentClass={"textarea"}
              value={job[context.key]}
              placeholder={context.placeholder}
              onChange={(event) => { const val = event.target.value; this.handleChange(val); }}
              style={{
                maxWidth: "100%",
                minWidth: "100%",
                minHeight: "5em",
                maxHeight: "10em"
              }}
            />
        }
        {context.help && <HelpBlock>{context.help}</HelpBlock>}
      </FormGroup>
    )
  };
}

export default FieldGroup;
