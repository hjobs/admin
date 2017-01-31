import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import 'whatwg-fetch';
// let Loading = require('react-loading');

import Board from './Board/Board';
import Login from './Login/Login';
import Profile from './Profile/Profile';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
        currentTab: 'profile',
        authToken: null,
        // baseUrl: 'http://52.221.40.15:3000/employer/',
        baseUrl: 'http://localhost:3100/employer/'
    };
  }

  componentWillMount() {
    // console.log("inside componentWillMount on App.js");
    // console.log(this.state);
    let token = window.localStorage.getItem("authToken");
    if (token) {
      this.setState({authToken: token});
    }
  }

  signInUp({org, me, auth_token}) {
    const data = {};
    data.org = org;
    data.me = me;
    if (auth_token) data.authToken = auth_token;
    this.setState(data, console.log(this.state));
  }

  signOut() {
    this.setState({authToken: null});
    localStorage.removeItem("authToken");
  }

  handleMenuSelect(eventKey) {
    if (eventKey === 0) this.signOut();
    this.setState({currentTab: eventKey});
  }

  render() {
    let content;
    if (this.state.authToken) {
      switch (this.state.currentTab) {
        case 'board': default:
          content = (
            <Board
              authToken={this.state.authToken}
              baseUrl={this.state.baseUrl}
              org={this.state.org}
              me={this.state.me} />
          );
          break;
        case 'profile':
          content = (
            <Profile
              authToken={this.state.authToken}
              baseUrl={this.state.baseUrl}
            />
          );
          break;
      }
    } else {
      content = (
        <Login
          baseUrl={this.state.baseUrl}
          signInUp={({org, me, auth_token}) => { this.signInUp({org: org, me: me, auth_token: auth_token}); }} />
      );
    }

    return (
      <div>
        <Navbar
          fluid inverse
          collapseOnSelect fixedTop
          onSelect={(eventKey) => this.handleMenuSelect(eventKey)}
        >
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">HJobs Admin</a>
            </Navbar.Brand>
            {this.state.authToken ? <Navbar.Toggle /> : null}
          </Navbar.Header>
          {
            this.state.authToken ?
              <Navbar.Collapse>
                <Nav pullRight>
                  <NavItem eventKey={'board'} href="#">Board</NavItem>
                  <NavItem eventKey={'profile'} href="#">Profile</NavItem>
                  <NavItem eventKey={0} href="#">Logout</NavItem>
                </Nav>
              </Navbar.Collapse>
              : null
          }
        </Navbar>
        {content}
      </div>
    );
  }
}

export default App;
