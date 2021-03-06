// import React from 'react';
import Reflux from 'reflux';
// import { withRouter, matchPath } from 'react-router-dom';
// const queryString = require("query-string");

import { request } from '../services/http';

export const UserActions = Reflux.createActions([
  "refreshUser",
  "logout",
  "setUser",
  "editUser",
  "editOrg",
  "deleteEmployer",
  "setLoading"
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
      userStoreLoading: true,
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
      const nextState = {
        me: userObject.me || this.state.me,
        org: userObject.org || this.state.org,
        employers: userObject.employers || this.state.employers,
        userStoreLoading: false
      };
      if (authToken) nextState.authToken = authToken;
      this.setState(nextState);
    }
  }

  editUser(obj) {
    // this.setLoading();
    request("employers/" + this.state.me.id, "PATCH", {employee: obj}).then(res => res.json()).then(d => {
      if (!d || !!d.errors) throw Error("Unprocessable edit data");
      this.setUser({me: d});
    })
  }

  editOrg(obj) {
    // this.setLoading();
    request("orgs/" + this.state.org.id, "PATCH", {org: obj}).then(res => res.json()).then(d => {
      if (!d || !!d.errors) throw Error("Unprocessable edit data");
      this.setUser({org: d});
      return {success: true};
    })
  }

  setLoading() { this.setState({userStoreLoading: true}); }

  

  getUserFromAuthToken() {
    this.setState({userStoreLoading: true});
    request('orgs/whoAreWe').then(res => res.json()).then(d => {
      if (!!d && !d.error) {
        this.setUser(d);
      } else {
        localStorage.removeItem("authToken");
      }
    })
  }

  deleteEmployer(employer) {
    this.setState({userStoreLoading: true});
    request("employers/" + employer.id, "DELETE").then(res => {
      if (res.ok) return {error: null};
      return {error: res.statusText};
    })
    .then(d => {
      const obj = {userStoreLoading: false};
      if (!!d && !d.error) {
        obj.modalErrorMsg = null;
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

  userObjectIsValid(userObject) { return !!userObject; }
}

UserStore.id = 'userStore';

export default UserStore;

