import React from 'react';
import { Fade } from 'react-bootstrap';
import Themes from '../../styles/theme';

const SuccessFade = ({successShown}) => (
  <Fade
    in={successShown}
    style={{
      top: 60,
      position: "fixed"
    }}
    mountOnEnter
    unmountOnExit
  >
    <div
      className="flex-row flex-vhCenter full-width">
      <div
        className="text-center"
        style={{
          backgroundColor: Themes.colors.green,
          color: Themes.colors.white,
          fontSize: Themes.fontSizes.s,
          padding: 8,
          borderRadius: 4
        }}
      >
        Successful!
      </div>
    </div>
  </Fade>
)

export default SuccessFade;
