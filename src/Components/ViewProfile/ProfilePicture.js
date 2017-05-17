import React from 'react';

const EmployeeProfilePicture = (props) => {
  const imageSize = props.imageSize || "100px";
  return (
    <img
      src={props.user.image}
      style={{
        height: imageSize,
        width: imageSize,
        borderRadius: "50%"
      }}
      alt="profile"
    />
  );
}

export default EmployeeProfilePicture;
