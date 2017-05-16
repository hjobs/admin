import React from 'react';
import Reflux from 'reflux';
import { withRouter } from 'react-router-dom';
// import { Button, Checkbox, Dropdown, Form } from 'semantic-ui-react';
import Loading from 'react-loading';
// import queryString from 'query-string';

import EmployeeProfileContent from './EmployeeProfileContent';

import JobStore, { JobActions } from '../../stores/jobStore';

import ErrorMessage from '../../Components/Misc/ErrorMessage';

class ViewProfile extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = JobStore;
    this.storeKeys = ["viewProfile"];
  }

  componentWillMount() {
    super.componentWillMount.call(this);
    JobActions.loadProfile(this.props.match.params.employeeId);
  }

  render() {
    if (!!this.state.viewProfile.error) return <ErrorMessage reason={this.state.viewJob.error} />
    if (!!this.state.viewProfile.loading || !this.state.viewJob.data) return <Loading />;

    return (
      <div className="flex-col flex-vCenter" style={{
        width: "100%",
        minHeight: "calc(100vh - 50px - 50px)",
        padding: "20px 0px 60px 0px",
        overflowX: "hidden",
        overflowY: "scroll"
      }}>
        <EmployeeProfileContent />
      </div>
    );
  }
}

export default withRouter(ViewProfile);
