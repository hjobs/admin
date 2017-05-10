import React from 'react';
import { FormGroup, ControlLabel, HelpBlock, FormControl } from 'react-bootstrap';

const FieldGroup = ({id, label, help, type, placeholder, props, value, inline, handleFormChange}) => {
  return (
    <FormGroup style={inline ? {display: "inline-block"} : null} controlId={id}>
      {!label ? null : <ControlLabel>{label}</ControlLabel>}
      {
        type !== "textarea" ?
          <FormControl
            value={value}
            {...props}
            placeholder={placeholder}
            type={type}
            onChange={(event) => { handleFormChange(event.target.value); }}
          />
          :
          <FormControl
            componentClass={type}
            value={value}
            placeholder={placeholder}
            onChange={(event) => { handleFormChange(event.target.value); }}
          />
      }
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
};

export default FieldGroup;
