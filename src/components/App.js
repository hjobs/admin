import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import 'whatwg-fetch';
let Loading = require('react-loading');

import Board from './Board/Board';
import Login from './Login/Login';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
        authToken: window.localStorage.getItem("authToken"),
        // baseUrl: 'http://52.221.40.15:3000/',
        baseUrl: 'http://localhost:3100/employer/',
        org: null,
        loading: true,
        employer: null,
        jobs: [],
        objects: []
    };
  }

  componentWillMount() {
    console.log("inside componentWillMount on App.js");
    console.log(this.state);
    if (this.state.authToken && (!this.state.org || !this.state.employer)) {
      this.loadData();
    } else if (!this.state.authToken || this.state.authToken === null) {
      this.setState({loading: false});
    }
  }

  onLogin(org, employer, token) {
    const data = {};
    data.loading = true;
    data.org = org;
    data.employer = employer;
    if (token) data.authToken = token;
    this.setState(data, () => { this.loadData(); });
  }

  loadData() {
    let url = this.state.baseUrl + 'orgs/showPostings';
    fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: this.state.authToken
      }
    })
      .then(res => {
        console.log(res);
        if (res.status > 300) {
          localStorage.removeItem("authToken");
          this.setState({authToken: null, loading: false});
        } else {
          return res.json();
        }
      })
      .then(d => {
        console.log(d);
        if (d.org) {
          let obj = {};
          obj.employer = d.employer;
          obj.org = d.org;
          obj.jobs = d.jobs;
          obj.projects = d.projects;
          obj.loading = false;
          this.setState(obj, () => { console.log(this.state); });
        } else {
          localStorage.removeItem("authToken");
          this.setState({authToken: null, loading: false});
        }
      });
  }

  signOut() {
    this.setState({authToken: null});
    localStorage.removeItem("authToken");
  }

  handleMenuSelect(eventKey) {
    switch (eventKey) {
      case 0: this.signOut(); break;
      default: break;
    }
  }

  render() {
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
                  <NavItem eventKey={0} href="#">Logout</NavItem>
                </Nav>
              </Navbar.Collapse>
              : null
          }
        </Navbar>
        {
          this.state.authToken ?
            (
              this.state.loading ?
                <div className="flex-row flex-vhCenter">
                  <Loading type="bubbles" color="#e3e3e3" />
                </div>
              :
                <Board
                  authToken={this.state.authToken}
                  baseUrl={this.state.baseUrl}
                  org={this.state.org}
                  employer={this.state.employer}
                  jobs={this.state.jobs}
                  projects={this.state.projects} />
            )
          :
            <Login
              baseUrl={this.state.baseUrl}
              login={(org, employer, token) => { this.onLogin(org, employer, token); }} />
        }
      </div>
    );
  }
}

export default App;
