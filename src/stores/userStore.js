// import React from 'react';
import Reflux from 'reflux';
// import { withRouter, matchPath } from 'react-router-dom';
// const queryString = require("query-string");

import Http from '../services/http';

export const UserActions = Reflux.createActions([
  "refreshUser",
  "logout",
  "setUser",
  "deleteEmployer"
]);
// ({
//   refreshUser: {asyncResult: true},
//   logout: {},
//   setUser: {asyncResult: true},
//   deleteEmployer: {asyncResult: true}
// });

class UserStore extends Reflux.Store {
  constructor() {
    super();
    this.state = this.getInitialState();
    this.listenables = UserActions;
    if (!!localStorage.getItem("authToken")) { this.refreshUser(); }
  }

  getInitialState() {
    return {
      me: null,
      authToken: localStorage.getItem("authToken"),
      org: null,
      employers: null
    };
  }

  refreshUser() { this.getUserFromAuthToken(); }

  /** @param {{org: object, employers: object[], me: object}} userObject @param {string} authToken */
  setUser(userObject, authToken) {
    if (this.userObjectIsValid(userObject)) {
      if (authToken) localStorage.setItem("authToken", authToken);
      this.setState(s => {
        s.me = userObject.me;
        s.org = userObject.org
        s.employers = userObject.employers;
        if (authToken) s.authToken = authToken;
        return s;
      });
    }
  }

  getUserFromAuthToken() {
    Http.request('orgs/whoAreWe').then(res => res.json()).then(d => {
      if (!!d && !d.error) {
        this.setUser(d);
      } else {
        localStorage.removeItem("authToken");
      }
    })
  }

  deleteEmployer(employer) {
    Http.request("employers/" + employer.id, "DELETE").then(res => {
      if (res.ok) return {error: null};
      return {error: res.statusText};
    })
    .then(d => {
      const obj = {};
      if (!!d && !d.error) {
        obj.employers = this.state.employers;
        const index = obj.employers.indexOf(employer);
        console.log("deleting local data, index is" + index);
        obj.employers.splice(index, 1);
        this.setState(obj);
      } else {
        obj.modalErrorMsg = d.error;
        this.setState(obj);
      }
    });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("employers");
    localStorage.removeItem("org");
    sessionStorage.removeItem("user_id");
    this.setState(this.getInitialState());
  }

  userObjectIsValid(userObject) { return !!userObject.me && !!userObject.org && !!userObject.employers; }
}

export default UserStore;
