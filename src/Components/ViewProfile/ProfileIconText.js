import React from 'react';
import Reflux from 'reflux';
import { withRouter } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import './Profile.css';

// import Variable from '../../services/var';

// import { userIconTextObjects } from '../../stores/data/profile';

class ProfileIconText extends Reflux.Component {
  render() {
    const { iconName, content } = this.props;

    return (
      <div>
        <div className="flex-row flex-vStart flex-noWrap icon-detail">
          {
            !iconName ? null :
              <div className="icon">
                <Icon name={iconName} />
              </div>
          }
          <div className="detail">
            {content}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProfileIconText);
