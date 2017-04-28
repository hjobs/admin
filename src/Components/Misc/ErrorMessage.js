import React from 'react';

/** @param {{size: "md"|"sm"|"lg", reason: string}} props */
const Loading = ({size, reason}) => {
  if (!size) size = 'md';
  let minHeight;
  switch (size) {
    case "sm":
      minHeight = "30px";
      break;
    case "lg":
      minHeight = "120px";
      break;
    case "md": default:
      minHeight = "60px";
      break;
  }
  return (
    <div className="flex-col flex-vhCenter" style={{minHeight: minHeight}}>
      <p style={{color: "red"}}>
        {
          reason ||
          "There is an error. Please check internet connection / contact us at info@hjobs.hk"
        }
      </p>
    </div>
  )
}

export default Loading;
