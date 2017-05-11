import React from 'react';
import Reflux from 'reflux';
import { withRouter } from 'react-router-dom';
// import { Button, Checkbox, Dropdown, Form } from 'semantic-ui-react';
import Loading from 'react-loading';
// import queryString from 'query-string';

import JobStore, { JobActions } from '../../stores/jobStore';

import ErrorMessage from '../../Components/Misc/ErrorMessage';

// import Variable from '../../services/var';
// import Http from '../../services/http';

class ViewJob extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = JobStore;
    this.storeKeys = ["viewJob"];
    console.log(["props", props]);
  }

  componentWillMount(props) {
    super.componentWillMount.call(this);
    JobActions.loadJob(this.props.match.params.jobId);
  }

  render() {
    if (!!this.state.viewJob.error) return <ErrorMessage reason={this.state.viewJob.error} />
    if (!!this.state.viewJob.loading || !this.state.viewJob.data) return <Loading />;

    return (
      <section className="view-job-page">
        {this.state.viewJob.data.id}
      </section>
    );
  }
}

export default withRouter(ViewJob);
