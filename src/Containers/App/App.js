import React from 'react';
import Reflux from 'reflux';
import { 
  Route,
  Redirect,
  withRouter,
  Switch
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import '../../styles/main.css';

import Login from '../Login/Login';
import NavBar from '../../Components/NavBar/NavBar';
import Board from '../Board/Board';
import Edit from '../Edit/Edit';
import Profile from '../Profile/Profile';

import UserStore from '../../stores/userStore';

// import Variable from '../services/var';
// import Http from '../../services/http';

class App extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = UserStore;
  }

  componentWillMount() {
    super.componentWillMount.call(this);
    this.checkRoute(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkRoute(nextProps);
  }

  checkRoute(props) {
    if (!/login/.test(props.location.pathname)) {
      const signedIn = !!localStorage.getItem("authToken");
      if (!signedIn) props.history.replace("/login");
    }
  }

  render() {
    const signedIn = !!this.state.authToken;
    const pathIsLogin = /^\/login/gi.test(this.props.location.pathname);
    return (
      <div style={{paddingTop: pathIsLogin ? "" : "71px"}}>
        <NavBar />
        <Switch>
          <Route exact path="/" component={() => <Redirect to="/jobs" />} />
          <Route path="/login" component={() => 
            signedIn ? <Redirect to="/board" /> : <Login />
          } />
          <Route path="/job/:jobId" component={Edit} />
          <Route path="/board" component={Board} />
          <Route path="/profile" component={Profile} />
          <Route component={() => <Redirect to="/board" />} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);

// <Route path="/login" component={Login} />
// <Route path="/jobs" component={Board} />