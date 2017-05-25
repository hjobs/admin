import React from 'react';

const FileInput = ({
  multiple = false,
  accept = "image/*",
  handleChange
}) => (
  <input
    type="file"
    accept={accept}
    multiple={multiple}
    onChange={evt => {
      evt.persist();
      const file = evt.target.files[0];
      handleChange(file);
    }}
  />
);

export default FileInput;