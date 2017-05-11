import React from 'react';
import Reflux from 'reflux';
import { withRouter } from 'react-router-dom';
// import { Button, Checkbox, Dropdown, Form } from 'semantic-ui-react';
import Loading from 'react-loading';
// import queryString from 'query-string';

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
    JobActions.loadJob(this.props.match.params.jobId);
  }

  render() {
    if (!!this.state.viewProfile.error) return <ErrorMessage reason={this.state.viewJob.error} />
    if (!!this.state.viewProfile.loading || !this.state.viewJob.data) return <Loading />;

    return (
      <section className="view-profile-page">
      </section>
    );
  }
}

export default withRouter(ViewProfile);
