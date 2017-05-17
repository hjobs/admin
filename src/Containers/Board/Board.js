import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router-dom';
import { Grid, Row, Clearfix } from 'react-bootstrap';
import { Button, Icon } from 'semantic-ui-react';
import 'whatwg-fetch';
let Loading = require('react-loading');
import './styles/board.css';

import Job from './Job';
import ErrorMessage from '../../Components/Misc/ErrorMessage';

import JobStore, { JobActions } from '../../stores/jobStore';

// import Variable from '../../services/var';
// import Http from '../../services/http';

class Board extends Reflux.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        show: false,
        isNew: true,
        data: null
      }
    };
    this.store = JobStore;
    this.refresh();
  }

  refresh() {
    JobActions.loadJobs();
  }

  render() {
    if (!!this.state.jobs.errorMsg) return <ErrorMessage reason={this.state.jobs.errorMsg} />;
    if (!!this.state.jobs.loading) return <ErrorMessage reason={<Loading type="bubbles" color="#337ab7" />}/>;
    if (!this.state.jobs) return null;

    return (
      <section className="board">
        <div
          className="flex-row flex-vhCenter add-job-div"
          onClick={() => this.props.history.push("/editJob/new")}
        >
          <Icon
            name="plus circle"
            size="huge"
          />
          <span>Add Job</span>
        </div>
        {
          !!this.state.jobs.data && this.state.jobs.data.length > 0 ?
            <Grid fluid>
              <Row>
                {
                  this.state.jobs.data.map((job, i) => [
                    <Job key={"board-job-" + i} job={job}/>,
                    (i % 2 !== 0) ? <Clearfix /> : null
                  ])
                }
              </Row>
            </Grid>
            :
            <ErrorMessage reason="You don't yet have job postings. Post a new job!" />
        }
      </section>
    ); // end render return()
  } // end render
}

export default Board;
