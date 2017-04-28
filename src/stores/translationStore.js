/**
 * @typedef {'en'|'zh-HK'} translationOptions
 */

import Reflux from 'reflux';
import tStrings from './data/translations.js';

import Http from '../services/http';

export const TranslationActions = Reflux.createActions([
  'setLocale'
]);

class TranslationStore extends Reflux.Store {
  constructor() {
    super();
    this.state = {
      locale: this.getLocale(),
      tStrings: this.getTranslations()
    };
    this.listenables = TranslationActions;
  }

  /** @param {translationOptions} str */
  getTranslations(str) {
    const key = str || this.getLocale();
    return tStrings[key];
  }

  getLocale() {
    return localStorage.getItem("locale") || "en";
  }

  /** @param {translationOptions} str */
  setLocale(str) {
    this.setState(s => {
      s.locale = str;
      s.tStrings = tStrings[str];
      return s;
    }, () => {
      Http.log({
        name: "change translation",
        action: this.state.locale,
        component: "navbar"
      });
    });
  }
}

export default TranslationStore;
