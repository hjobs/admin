import React from 'react';
import Reflux from 'reflux';
import { Grid, Row, Col } from 'react-bootstrap';
// import { Redirect } from 'react-router-dom';
import './styles/ProfileContent.css';

// import ProfilePicture from '../../Components/EmployeeProfile/ProfilePicture';
// import ProfileIconText from '../../Components/Profile/ProfileIconText';
// import ProfileJobExp from '../../Components/Profile/ProfileJobExp';
// import ErrorDiv from '../../Components/Utilities/ErrorDiv';

import UserStore from '../../stores/userStore';
import TranslationStore from "../../stores/translationStore";

// import Variable from '../../services/var';
// import Http from '../../services/http';

// import { userIconTextObjects } from '../../stores/data/profile';

class EmployeeProfileContent extends Reflux.Component {
  constructor(props) {
    super(props);
    this.stores = [UserStore, TranslationStore];
  }

  render() {
    // if (!this.state.authToken || !this.state.user) return <ErrorDiv error="You are not signed in." />;
    const t = this.state.tStrings;

    return (
      <Grid fluid className="profile-content-container">
        <Row>
          <Col xs={12} md={6}>
            <div className="bright-segment">
              <div className="flex-col flex-vhCenter full-width profile-picture-outter-container">
                {//<ProfilePicture />
                }
              </div>
              <div className="profile-detail-container">
                {/*<ProfileIconText
                  context={{key: "name", iconName: null, element: "h3", elementClassName: "text-center"}}
                />
                */}
                <div style={{height: "10px"}} />
                {
                  // userIconTextObjects.map(obj => (
                  //   <ProfileIconText
                  //     key={'profile-icon-text-' + obj.key}
                  //     context={obj}
                  //   />
                  //   null
                  // ))
                }
              </div>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="flex-row flex-vhCenter bright-segment">
              {//<ProfileJobExp />
              }
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default EmployeeProfileContent;
