import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import Home from './Home/Home';
import Jobs from './Jobs/Jobs';
import Projects from './Projects/Projects';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
        currentTab: 1
    };
  }
  handleSelect(eventKey) {
    this.setState({ currentTab: eventKey });
  }
  render() {
    let content;
    switch (this.state.currentTab) {
      case 2: content = <Jobs />; break;
      case 3: content = <Projects />; break;
      case 1: default: content = <Home />; break;
    }
    return (
      <div>
        <Navbar fluid={true} onSelect={(eventKey) => this.handleSelect(eventKey)} inverse collapseOnSelect fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">HJobs</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <NavItem eventKey={1} href="#">Home</NavItem>
              <NavItem eventKey={2} href="#">Jobs</NavItem>
              <NavItem eventKey={3} href="#">Projects</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {content}
      </div>
    );
  }
}

export default App;
