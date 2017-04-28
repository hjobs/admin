import React from 'react';
import Reflux from 'reflux';
import { Button, Table } from 'react-bootstrap';
import { Icon } from 'semantic-ui-react';
import 'whatwg-fetch';
let Loading = require('react-loading');

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
            <Button
              bsSize="small"
              bsStyle="link"
              disabled={this.state.jobs.loading}
              onClick={() => { this.props.history.push("/job/" + job.id); }}
            >
              Edit
            </Button>
          </td>
          <td>
            <Button
              bsSize="small"
              bsStyle="link"
              disabled={this.state.jobs.loading}
              onClick={() => { JobActions.delete(i); }}
            >
              X
            </Button>
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
        <div className="flex-col flex-vhCenter" style={{fontSize: "36px", padding: "20px"}}>
          <Icon
            name="plus circle"
            size="big"
            link
            className="add"
            onClick={() => this.props.history.push("/job/new") }
          />
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
                  <th>Show Description</th>
                  <th>Delete</th>
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
