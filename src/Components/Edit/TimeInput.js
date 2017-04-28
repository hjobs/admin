import React from 'react';

const TimeInput = ({id, placeholder, value, max, handleChange}) => {
  return (
    <input
      type="number"
      placeholder={placeholder}
      maxLength={2}
      className="time-input"
      value={value}
      onChange={event => {
        handleChange(event.target.value);
      }}
    />
  );
};

export default TimeInput;
