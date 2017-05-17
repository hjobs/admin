import React from 'react';
import Reflux from 'reflux';
import { Grid, Row, Col } from 'react-bootstrap';
// import { Redirect } from 'react-router-dom';
import './styles/ProfileContent.css';
import Themes from '../../styles/theme';

import EmployeeProfilePicture from '../../Components/ViewProfile/ProfilePicture';
import ProfileIconText from '../../Components/ViewProfile/ProfileIconText';
import ProfileJobExp from '../../Components/ViewProfile/ProfileJobExp';
// import ErrorDiv from '../../Components/Utilities/ErrorDiv';

import { getLocale } from '../../stores/translationStore';
const locale = getLocale();

// import Variable from '../../services/var';
// import Http from '../../services/http';

// import { userIconTextObjects } from '../../stores/data/profile';

const t = {
  en: {
    notGiven: "Did not provide"
  },
  "zh-HK": {
    notGiven: "沒有提供"
  }
};

const userIconTextObjects = [
  {
    key: "email",
    iconName: "at"
  },
  {
    key: "phone",
    iconName: "phone"
  },
  {
    key: "location",
    iconName: "location arrow",
    getValue: obj => !obj ? t[locale].notGiven : obj.address || t[locale].notGiven
  },
  {
    key: "lang_qs",
    iconName: "comment outline",
    getValue: array => {
      if (!array.toString()) return t[locale].notGiven;
      return array.reduce((dom, curr, i) => {
        dom.push(<span key={"lang_qs_" + i}>{curr.lang_name} ({curr.level})</span>);
        if (i < array.length - 1) dom.push(<br key={"lang_qs_separator_" + i} />)
        return dom;
      }, [])
    }
  },
  {
    key: "cv",
    iconName: "attach",
    getValue: url => {
      if (!url) return t[locale].notGiven;
      return (
        <a href={url} target="_blank">{url} (CV)</a>
      );
    }
  },
  {
      key: "description",
      elementClassName: "pre-line",
      iconName: "sticky note outline",
      editType: "textarea",
      doNotSubmitOnEnter: true
  }
];

class EmployeeProfileContent extends Reflux.Component {
  render() {
    const { user } = this.props;

    return (
      <Grid fluid className="full-width" style={{maxWidth: "100%", padding: 0}}>
        <Row style={{fontSize: Themes.fontSizes.m}}>
          <Col xs={12} md={6}>
            <div className="bright-segment">
              <div className="flex-col flex-vhCenter full-width" style={{padding: 10}}>
                <EmployeeProfilePicture user={user} />
              </div>
              <div className="profile-detail-container">
                <h3 className="text-center" children={user.name} />
                <div style={{height: "10px"}} />
                {
                  userIconTextObjects.map(obj => (
                    <ProfileIconText
                      key={'profile-icon-text-' + obj.key}
                      context={obj} // not used
                      iconName={obj.iconName}
                      content={
                        obj.getValue ?
                        obj.getValue(user[obj.key])
                        :
                        user[obj.key] || t[locale].notGiven
                      }
                    />
                  ))
                }
              </div>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="flex-row flex-vhCenter bright-segment">
              <ProfileJobExp user={user} />
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default EmployeeProfileContent;
