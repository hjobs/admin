import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { Button, Icon } from 'semantic-ui-react';
import 'whatwg-fetch';
let Loading = require('react-loading');
import './board.css';

// import Job from './Job';

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

  renderTable(jobArr) {
    if (!jobArr || jobArr.length <= 0) return null;
    console.log(jobArr);
    return jobArr.map((job, i) => {
      const updatedAt = (new Date(job.updated_at).toLocaleDateString());
      let salaryDescription = "";
      const salaryUnit = !!job.salary_unit ? (" /" + job.salary_unit) : "";
      switch (job.salary_type) {
        case "range":
          salaryDescription = "$" + job.salary_low + "-" + job.salary_high + salaryUnit;
          break;
        case "specific":
          salaryDescription = "$" + job.salary_value + salaryUnit;
          break;
        case "negotiable":
          salaryDescription = "negotiable";
          break;
        default:
          salaryDescription = "no info";
          break;
      }
      return (
        <tr key={"jobs_long_" + job.id} >
          <td>{job.job_type}</td>
          <td>{job.title}</td>
          <td>{updatedAt}</td>
          <td>{salaryDescription}</td>
          <td>
            <Link to={"/viewJob/" + job.id}>
              View
            </Link>
          </td>
          <td>
            <Link to={"/editJob/" + job.id}>
              Edit
            </Link>
          </td>
          <td>
            <span
              className="link"
              onClick={() => { if (!this.state.jobs.loading) JobActions.delete(i); }}
            >
              X
            </span>
          </td>
        </tr>
      );
    });
  }

  render() {
    if (!this.state.jobs)
    if (!!this.state.jobs.errorMsg) return (<div className="flex-row full-width" style={{minHeight: '50px'}}> {this.state.jobs.errorMsg} </div>);
    if (!!this.state.jobs.loading) return (<div className="flex-row flex-vhCenter" style={{minHeight: '50px'}}><Loading type="bubbles" color="#337ab7" /></div>);

    return (
      <section className="board">
        {/*
          <div className="flex-col flex-vhCenter" style={{fontSize: "18px"}}>
            <p>
              You have posted {this.state.jobs.quick.length} quick jobs,
              {this.state.jobs.stable.length} stable jobs,
              {this.state.jobs.intern.length} internships,
              and {this.state.jobs.project.length} projects.</p>
          </div>
        */}
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
        {/*
          <div className="toggle-div">
            <h4 className="inline">{obj.name}s</h4>
            <Button bsStyle="link" onClick={() => { this.togglePanel(obj.value); }}>
              {this.state.panelOpen[obj.value] ? "collapse" : "show" } ({this.state.jobs[obj.value].length})
            </Button>
          </div>
          <Panel collapsible expanded={this.state.panelOpen[obj.value]}>
          </Panel>
        */}
        {
          !!this.state.jobs ?
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Updated At</th>
                  <th>Salary</th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.renderTable(this.state.jobs.data)}
              </tbody>
            </Table>
            :
            <div className="flex-col flex-vhCenter" style={{fontSize: "18px"}}>
              You don't yet have job postings. Post a new job!
            </div>
        }
      </section>
    ); // end render return()
  } // end render
}

export default Board;
