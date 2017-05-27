import React from 'react';

const EmployeeProfilePicture = ({user, imageSize}) => {
  imageSize = imageSize || "100px";
  return (
    <div
      className="job-thumbnail"
      style={{
        backgroundImage: "url('" + user.image + "')",
        width: imageSize,
        height: imageSize,
        maxWidth: imageSize,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        borderRadius: "50%",
        border: 0
      }}
    />
  );
}

export default EmployeeProfilePicture;
