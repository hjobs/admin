import React from 'react';
import Reflux from 'reflux';

import { Image } from 'semantic-ui-react';

import UserStore from '../../stores/userStore';

class ProfilePicture extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = UserStore;
  }

  render() {
    const imageSize = this.props.imageSize || "100px"
    return (
      <div className="flex-row flex-vhCenter">
        <Image shape="circular" src={this.state.user.image} style={{
          height: imageSize,
          width: imageSize
        }} alt="profile image" />
      </div>
    );
  }
}

export default ProfilePicture;
