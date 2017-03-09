import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import 'whatwg-fetch';
// let Loading = require('react-loading');

import Board from './Board/Board';
import Login from './Login/Login';
import Profile from './Profile/Profile';

import Variable from '../services/var';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
        currentTab: 'board',
        authToken: null
    };
    this.vars = new Variable();
  }

  componentWillMount() {
    // console.log("inside componentWillMount on App.js");
    // console.log(this.state);
    const token = window.localStorage.getItem("authToken");
    if (token) this.setState(s => { s.authToken = token; return s; });
  }

  signInUp({org, me, auth_token}) {
    this.setState(s => {
      s.org = org;
      s.me = me;
      if (auth_token) s.authToken = auth_token;
      return s;
    });
  }

  signOut() {
    this.setState(s => { s.authToken = null; return s; });
    localStorage.removeItem("authToken");
  }

  /** @param {'board'|'profile'|'logout'} eventKey */
  handleMenuSelect(eventKey) {
    if (eventKey === 'logout') this.signOut();
    else this.setState(s => { s.currentTab = eventKey; return s; });
  }

  render() {
    let content;
    if (this.state.authToken) {
      switch (this.state.currentTab) {
        case 'board': default:
          content = (
            <Board
              authToken={this.state.authToken}
              org={this.state.org}
              me={this.state.me} />
          );
          break;
        case 'profile':
          content = (
            <Profile
              authToken={this.state.authToken}
            />
          );
          break;
      }
    } else {
      content = (
        <Login
          signInUp={({org, me, auth_token}) => { this.signInUp({org, me, auth_token}); }} />
      );
    }

    return (
      <div>
        {this.state.authToken ?
          <Navbar
            fluid inverse
            collapseOnSelect fixedTop
            onSelect={(eventKey) => this.handleMenuSelect(eventKey)}>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#" onClick={() => { this.handleMenuSelect('board'); }}>HJobs Admin</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
              <Navbar.Collapse>
                <Nav pullRight>
                  <NavItem eventKey={'board'} href="#">Board</NavItem>
                  <NavItem eventKey={'profile'} href="#">Profile</NavItem>
                  <NavItem eventKey={'logout'} href="#">Logout</NavItem>
                </Nav>
              </Navbar.Collapse>
          </Navbar>
          : null
        }
        {content}
      </div>
    );
  }
}

export default App;
