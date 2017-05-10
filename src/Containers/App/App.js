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

  render() {
    const signedIn = !!this.state.authToken;
    const pathIsLogin = /^\/login/gi.test(this.props.location.pathname);
    if (!pathIsLogin && !signedIn) return <Redirect to="/login" />;
    else if (pathIsLogin && signedIn) return <Redirect to="/board" />;

    return (
      <div style={{paddingTop: pathIsLogin ? "" : "71px"}}>
        <NavBar />
        <Switch>
          <Route exact path="/" component={() => <Redirect to="/jobs" />} />
          <Route path="/login" component={Login} />
          <Route path="/editJob/:jobId" component={Edit} />
          <Route path="/viewEmployee/:employeeId" component={null} />
          <Route path="/board" component={Board} />
          <Route path="/profile" component={Profile} />
          <Route component={() => <Redirect to="/board" />} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
