import React from 'react';
import Reflux from 'reflux';
import { withRouter } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import './Profile.css';

import EditText from './EditText';
import EditLocation from './EditLocation';
import EditLanguage from './EditLanguage';
import SaveCancel from './SaveCancel';

import UserStore, { UserActions } from '../../stores/userStore';
import TranslationStore from '../../stores/translationStore';

import Variable from '../../services/var';

// import { userIconTextObjects } from '../../stores/data/profile';

class ProfileIconText extends Reflux.Component {
  constructor(props) {
    super(props);
    this.stores = [UserStore, TranslationStore];
  }

  initiateEdit() {
    const context = this.props.context;
    console.log(["initiate edit, logging context", context]);
    const editData = (
      context.getInitialEditValue?
        context.getInitialEditValue(this.state.user[context.key]) :
        this.state.user[context.key] || ""
    );
    UserActions.editProfileItem(editData, context.key);
  }

  renderDetail() {
    const context = this.props.context,
          t = this.state.tStrings,
          canInitiateEdit = this.state.profile.editing.key === null;

    let textClassName = !this.state.profile.editing.key ? "editable-text" : "";
    if (context.elementClassName) textClassName += " " + context.elementClassName;

    let text = t.profile.notGiven;
    const userInfo = this.state.user[context.key];
    if (!!context.getValue) text = context.getValue(userInfo);
    else if ( !!userInfo && userInfo !== null && !!userInfo.toString()) {
      text = userInfo;
    }
    let textSpan = (
      <span className="text-span">
        {text}{' '}
        {
          !canInitiateEdit ? null :
            <Icon
              className="edit-icon link"
              link
              name="pencil"
              onClick={() => this.initiateEdit()}
            />
        }
      </span>
    );

    let props = {
      className: textClassName
      // onClick: canInitiateEdit ? () => { this.initiateEdit(); } : null
    };

    return (
      React.createElement(
        context.element || 'span',
        props,
        textSpan
      )
    )
  }

  renderEdit() {
    const context = this.props.context;
    switch (context.editType) {
      case "Lang":
        return <EditLanguage />;
      case "Location":
        return <EditLocation />;
      default:
        return (<EditText context={context}/>);
    }
  }

  render() {
    const context = this.props.context,
          editing = this.state.profile.editing.key === context.key;

    return (
      <div>
        <div className="flex-row flex-vStart flex-noWrap icon-detail">
          {
            !context.iconName ? null :
              <div className="icon">
                <Icon name={context.iconName} />
              </div>
          }
          <div className="detail">
            {
              !editing ?
                this.renderDetail()
                :
                this.renderEdit()
            }
          </div>
        </div>
        {
          !editing ? null :
          <div className="save-cancel-container">
            <SaveCancel />
          </div>
        }
      </div>
    );
  }
}

export default withRouter(ProfileIconText);
