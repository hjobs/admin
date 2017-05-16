import React from 'react';
import Reflux from 'reflux';

import UserStore, { UserActions } from '../../stores/userStore';

class EditText extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = UserStore;
  }

  render() {
    const context = this.props.context;
    return (
      React.createElement(
        this.props.domType || "input",
        {
          autoFocus: true,
          type: context.inputType,
          disabled: this.state.profile.loading,
          className: "edit-text full-width",
          style: context.style || null,
          value: this.state.profile.editing.data,
          placeholder: context.placeholder,
          onKeyDown: (event) => { if (event.which === 13 && !context.doNotSubmitOnEnter) UserActions.submitProfileEdit(); },
          onChange: (event) => { UserActions.editProfileItem(event.target.value); }
        }
      )
    );
  }
}

export default EditText;
