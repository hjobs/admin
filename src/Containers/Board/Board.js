import React from 'react';
import Reflux from 'reflux';
import { Grid, Row, Clearfix } from 'react-bootstrap';
import { Icon } from 'semantic-ui-react';
import 'whatwg-fetch';
const queryString = require("query-string");
let Loading = require('react-loading');
import Themes from '../../styles/theme';

import Job from './Job';
import ErrorMessage from '../../Components/Misc/ErrorMessage';
import SuccessFade from '../../Components/Misc/SuccessFade';

import JobStore, { JobActions } from '../../stores/jobStore';
import { EditActions } from '../../stores/editStore';

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
      },
      successShown: false
    };
    this.store = JobStore;
    this.storeKeys= ["jobs"];
    this.refresh();
  }

  componentWillMount() {
    super.componentWillMount.call(this);
    const queryObj = queryString.parse(this.props.location.search);
    if (queryObj && !!queryObj.successShown) {
      this.setState({successShown: true}, () => {
        window.setTimeout(() => this.setState({successShown: false}), 3000);
        this.props.history.replace('/board')
      });
    }
    EditActions.reset();
  }

  refresh() {
    JobActions.loadJobs();
  }

  render() {
    if (!!this.state.jobs.error) return <ErrorMessage reason={this.state.jobs.error} />;
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
            <ErrorMessage reason={this.state.jobs.errorMsg || "You don't yet have job postings. Post a new job!"} />
        }

        <SuccessFade
          successShown={this.state.successShown}
        />
      </section>
    ); // end render return()
  } // end render
}

export default Board;
