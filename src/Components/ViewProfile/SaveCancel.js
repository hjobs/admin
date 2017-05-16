import React from 'react';
import Reflux from 'reflux';
// import { Link, withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import { UserActions} from '../../stores/userStore';
import TranslationStore from '../../stores/translationStore';

class SaveCancel extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = TranslationStore
  }

  render() {
    const t = this.state.tStrings;
    return (
      <div className="flex-row flex-vhCenter save-cancel">
        <Button
          color="green"
          content={t.buttons.save}
          onClick={() => UserActions.submitProfileEdit()}
        />
        <Button
          color="red"
          content={t.buttons.cancel}
          onClick={() => UserActions.cancelProfileEdit()}
        />
      </div>
    )
  }
}

export default SaveCancel;
