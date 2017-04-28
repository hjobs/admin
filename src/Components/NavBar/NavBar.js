import React from 'react';
import Reflux from 'reflux';
import { withRouter, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

// import Variable from '../../services/var';
// import Http from '../../services/http';

import UserStore, { UserActions } from '../../stores/userStore';

import { navBarObjs } from './NavBarVars'

class NavBarWithoutRouter extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = UserStore;
  }

  /** @param {{name: string, route: string, logName: string}} obj */
  handleMenuSelect(obj) {
    if (!!obj.route) {
      this.props.history.push(obj.route);
    } else  if (obj.name === "Logout") {
      UserActions.logout();
      this.props.history.push("/")
    }
  }

  render() {
    const loggedIn = !!this.state.authToken;
    if (!loggedIn) return null;

    /** @type {string} */
    const pathname = this.props.location.pathname;

    return (
        <Navbar
          fluid inverse
          collapseOnSelect fixedTop
          onSelect={(obj) => this.handleMenuSelect(obj)}>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/board">HJobs Admin</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {
                navBarObjs.map(obj => (
                  <NavItem
                    active={obj.route && pathname.search(obj.route) >= 0}
                    eventKey={obj}
                    href="#"
                    key={'navbar-' + obj.name}>
                    {obj.name}
                  </NavItem>
                ))
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
    );
  }
}

export default withRouter(NavBarWithoutRouter);
