import React from 'react';
import ReactLoading from 'react-loading';

/** @param {{size: "md"|"sm"|"lg", color: string}} props */
const Loading = ({size, color}) => {
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
    <div className="flex-col flex-vhCenter"  style={{minHeight: minHeight}}>
      <ReactLoading type="bubbles" color={color || "#101010"} />
    </div>
  )
}

export default Loading;
