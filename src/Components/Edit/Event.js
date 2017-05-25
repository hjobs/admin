import React from 'react';
import Reflux from 'reflux';
import { Checkbox } from 'semantic-ui-react';
import Themes from '../../styles/theme';

import EditStore, { EditActions } from '../../stores/editStore';

class Event extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = EditStore;
    this.storeKeys = ["event"];
  }

  render() {
    const event = this.state.event;
    return (
      <div className="flex-row flex-vCenter" style={{fontSize: Themes.fontSizes.s}} >
        <Checkbox
          checked={event.isEvent}
          label="this is an event"
          onClick={() => EditActions.toggleEvent()}
        /><span style={{visibility: "hidden"}}>"a"</span>
        {
          !event.isEvent ? null :
            <input
              style={{display: "inline-block", width: "20rem"}}
              value={event.event}
              maxLength={20}
              onKeyDown={(evt) => { if (evt.keyCode === 13) evt.preventDefault(); }}
              onChange={(event) => { const val = event.target.value; EditActions.editJob("event", "event", val); }}
              placeholder="Event name here"
            />
        }
      </div>
    );
  }
}

export default Event;
