import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import 'whatwg-fetch';
// let Loading = require('react-loading');

import Board from './Board/Board';
import Login from './Login/Login';
import Profile from './Profile/Profile';

// import Variable from '../services/var';
import Http from '../services/http';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
        currentTab: 'board',
        org: null,
        me: null
    };
    this.http = new Http();
  }

  signInUp({org, me, authToken}) {
    this.http.setAuthToken(authToken);
    this.setState(s => {
      s.org = org;
      s.me = me;
      return s;
    });
  }

  signOut() {
    this.setState(s => { s.org = null; s.me = null; return s; });
    this.http.setAuthToken();
  }

  /** @param {'board'|'profile'|'logout'} eventKey */
  handleMenuSelect(eventKey) {
    if (eventKey === 'logout') this.signOut();
    else this.setState(s => { s.currentTab = eventKey; return s; });
  }

  render() {
    let content;
    if (!!this.http.authToken) {
      switch (this.state.currentTab) {
        case 'board': default:
          content = (
            <Board
              signOut={() => { this.signOut(); }}
              org={this.state.org}
              me={this.state.me} />
          );
          break;
        case 'profile':
          content = (
            <Profile />
          );
          break;
      }
    } else {
      content = (
        <Login signInUp={({org, me, authToken}) => { this.signInUp({org, me, authToken}); }} />
      );
    }

    return (
      <div>
        {!!this.http.authToken ?
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
