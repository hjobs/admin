import React from 'react';
import Reflux from 'reflux';
import { Checkbox, Dropdown } from 'semantic-ui-react';

import EditStore, { EditActions } from '../../stores/editStore';

import { langObjects } from '../../stores/data/misc'

class Langs extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = EditStore;
    this.storeKeys = ["langs"];
  }

  render() {
    const langs = this.state.langs;
    return (
      <div style={{fontSize: "12px"}}>
        <Checkbox
          checked={langs.hasLang}
          label="has language requirement"
          onClick={() => EditActions.toggleLangs()}
        /><span style={{visibility: "hidden"}}>"a"</span>
        {
          !langs.hasLang ? null :
            <Dropdown
              multiple
              placeholder="choose here"
              pointing="bottom"
              onClick={() => this.props.scrollBottom()}
              onChange={(e, data) => EditActions.editJob("langs", "langs", data.value)}
              value={langs.langs}
              options={langObjects}
            />
        }
      </div>
    );
  }
}

export default Langs;
