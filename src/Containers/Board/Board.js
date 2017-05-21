import React from 'react';
import Reflux from 'reflux';
import { Grid, Row, Clearfix } from 'react-bootstrap';
import { Icon } from 'semantic-ui-react';
import 'whatwg-fetch';
let Loading = require('react-loading');
import Themes from '../../styles/theme';

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
    this.storeKeys= ["jobs"];
    this.refresh();
  }

  refresh() {
    JobActions.loadJobs();
  }

  render() {
    if (!!this.state.jobs.errorMsg) return <ErrorMessage reason={this.state.jobs.errorMsg} />;
    if (!!this.state.jobs.loading) return <ErrorMessage reason={<Loading type="bubbles" color="#337ab7" />}/>;
    // if (!this.state.jobs) return null;

    return (
      <section style={{marginTop: -20, paddingTop: 0}}>
        <div
          className="flex-row flex-vhCenter add-job-div cursor"
          style={{
            backgroundColor: Themes.colors.yellow,
            color: Themes.colors.offWhite,
            padding: 15,
            margin: "0px 0px 15px 0px",
            fontSize: Themes.fontSizes.l
          }}
          onClick={() => this.props.history.push("/editJob/new")}
        >
          <Icon
            name="plus circle"
            size="big"
          />
          Add Job
        </div>
        {
          !!this.state.jobs.data && this.state.jobs.data.length > 0 ?
            <Grid fluid style={{maxWidth: 830}}>
              <Row>
                {
                  this.state.jobs.data.map((job, i) => {
                   const arr = [
                      <Job key={"board-job-" + job.id} job={job}/>
                    ];
                    if (i % 2 !== 0) arr.push(<Clearfix key={'board-clearfix-' + i} />)
                    return arr;
                  })
                }
              </Row>
            </Grid>
            :
            <ErrorMessage reason={this.state.job.error || "You don't yet have job postings. Post a new job!"} />
        }
      </section>
    ); // end render return()
  } // end render
}

export default Board;
