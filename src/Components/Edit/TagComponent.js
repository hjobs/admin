import React from 'react';
import Reflux from 'reflux';
import { Checkbox } from 'semantic-ui-react';

import EditStore, { EditActions } from '../../stores/editStore';
import TranslationStore from '../../stores/translationStore';
import { jobTags, jobTagTranslations } from '../../stores/data/tags.js';

class TagComponent extends Reflux.Component {
  constructor(props) {
    super(props);
    this.stores = [EditStore, TranslationStore];
    this.storeKeys = ["loading", "job", "locale"];
  }

  render() {
    const locale = this.state.locale || "en";
    return (
      <div style={{padding: "7px 0px", fontSize: "12px"}} >
        <label>Add tags</label>
        <div style={{padding: "0px 0px 0px 2em"}}>
          {
            jobTags.map(tagGroup => (
              <div key={'tag_group_' + tagGroup.group} className="flex-row flex-vCenter flex-hStart" style={{flexWrap: "nowrap"}}>
                <div style={{fontSize: 16}}>
                  <b>{jobTagTranslations.group[tagGroup.group][locale]}:{' '}</b>
                </div>
                <div>
                  {tagGroup.codes.map(codeObj => {
                    const currentTags = this.state.job.jobTags || [];
                    const tagPosition = currentTags.map(t => t.tag_id).indexOf(codeObj.id);
                    const tagExists = tagPosition !== -1;
                    const tag = currentTags[tagPosition];
                    const tagDestroyed = tagExists && !!tag["_destroy"];
                    const tagIsFromServer = tagExists && !!tag.created_at;

                    return (<Checkbox
                      style={{padding: "0px 7px"}}
                      key={'tag_code_' + codeObj.code}
                      checked={tagExists && !tagDestroyed}
                      label={jobTagTranslations.code[codeObj.code][locale] + " "}
                      onChange={() => { if (!this.state.loading) {
                        if (!tagExists) currentTags.push({
                          tag_id: codeObj.id
                        });
                        else if (tagDestroyed) delete tag["_destroy"];
                        else {
                          if (tagIsFromServer) tag["_destroy"] = 1;
                          else currentTags.splice(tagPosition, 1);
                        }
                        EditActions.editJob("job", "tags", currentTags);
                      }} }
                    />)
                  })}
                </div>
              </div>
            ))         
          }
        </div>
      </div>
    );
  }
}

export default TagComponent;