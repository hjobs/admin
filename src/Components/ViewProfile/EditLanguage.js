import React from 'react';
import Reflux from 'reflux';
// import { withRouter } from 'react-router-dom';
import { Select, Icon } from 'semantic-ui-react';
// import './Profile.css';

import UserStore, { UserActions } from '../../stores/userStore';
import TranslationStore from '../../stores/translationStore';

// import Http from '../../services/http';

import { levelArr, langArr, langObj } from '../../stores/data/profile';

class EditLocation extends Reflux.Component {
  constructor(props) {
    super(props);
    this.stores = [UserStore, TranslationStore];
  }

  getLevelArr() {
    const t = this.state.tStrings;
    return levelArr.map(level => ({
      key: level.key,
      value: level.value,
      text: t.profile[level.text]
    }));
  }

  addLanguage(langCode) {
    const editingData = this.state.profile.editing.data;
    const alreadyAdded = editingData.reduce((result, curr) => {
      return (curr.lang_code === langCode) || result;
    }, false);
    console.log(["langCode", langCode, "editingData", editingData, "alreadyAdded", alreadyAdded]);

    if (!alreadyAdded) {
      editingData.push({
        lang_code: langCode,
        level: ""
      });
      console.log(["editingData", editingData]);
      UserActions.editProfileItem(editingData);
    }
  }

  delete(index) {
    const editingData = this.state.profile.editing.data;
    editingData[index]["_destroy"] = true
    UserActions.editProfileItem(editingData);
  }

  /** takes index from profile.editing.data array and append the fluency aas val @param {number} index @param {string} val */
  editFluency(index, val) {
    const data = this.state.profile.editing.data;
    data[index].level = val;
    UserActions.editProfileItem(data);
  }

  render() {
    const profile = this.state.profile,
          t = this.state.tStrings;
    return (
      <div className="edit-location-container full-width">
        {
          profile.editing.data.map((obj, i, arr) => obj._destroy ? null : (
            <div key={'editing_language_' + i} className="flex-row flex-vhCenter full-width lang-code-level">
              <div className="lang-code">
                {langObj[obj.lang_code].name}
              </div>
              <div className="level">
                <select
                  disabled={profile.loading}
                  onChange={(e) => { const val = e.target.value; this.editFluency(i, val); }}
                  value={obj.level}
                >
                  <option disabled value="">{t.profile.levelPlaceholder}</option>
                  {this.getLevelArr().map(item => (
                    <option key={item.key} value={item.value}>{item.text}</option>
                  )) }
                </select>
                {/*
                <Select
                  className="language-select"
                  loading={profile.loading}
                  placeholder={t.profile.levelPlaceholder}
                  search
                  onChange={(e, data) => {
                    const editData = arr;
                    editData[i].level = data.value;
                    UserActions.editProfileItem(editData);
                  }}
                  selectOnBlur
                  options={this.getLevelArr()}
                />
                */}
              </div>
              <div
                className="delete"
                onClick={() => { this.delete(i); }}
              >
                <Icon name="delete" />
              </div>
            </div>
          ))
        }
        {/*
          <div className="full-width">
            <div className="half-width">
              <Select
                className="language-select"
                loading={profile.loading}
                placeholder={t.profile.languagePlaceholder}
                size="mini"
                search
                onChange={(a, b) => { console.log(["onChange logging a,b ", a,b]); }}
                selectOnBlur
                options={langArr}
              />
            </div>
            <div className="half-width">
              <Select
                className="language-select"
                loading={profile.loading}
                placeholder={t.profile.languagePlaceholder}
                size="mini"
                search
                onChange={(a, b) => { console.log(["onChange logging a,b ", a,b]); }}
                selectOnBlur
                options={langArr}
              />
            </div>
          </div>
        */}
        <Select
          className="language-select"
          loading={profile.loading}
          placeholder={t.profile.addLanguagePlaceholder}
          size="mini"
          search
          value={""}
          onChange={(e, data) => this.addLanguage(data.value)}
          selectOnBlur
          options={langArr}
        />
        { !profile.errorMsg ? null :
            <p className="text-red">{profile.errorMsg}</p>
        }
      </div>
    )
  }
}

export default EditLocation;
