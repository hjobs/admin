import React from 'react';
import { Button, Panel, Table } from 'react-bootstrap';
import { Icon } from 'semantic-ui-react';
import 'whatwg-fetch';
let Loading = require('react-loading');

// import Job from './Job';
import JobModal from '../JobModal/JobModal';

import Variable from '../../services/var';
import Http from '../../services/http';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openProjectPanel: false,
      panelOpen: {
        quick: true,
        stable: true,
        intern: true,
        project: true
      },
      modal: {
        show: false,
        type: "new",
        data: null
      },
      jobs: {
        quick: null,
        stable: null,
        intern: null,
        project: null
      },
      loading: true,
      errorMsg: null
    };
    console.log(["Board constructor called"]);
    this.vars = new Variable();
    this.http = new Http();
  }

  componentWillMount() { this.refresh(); }

  refresh() {
    const onError = (err) => {
      this.setState(s => {
        s.loading = false;
        s.errorMsg = err;
        return s;
      }, () => { this.props.signOut(); });
    };

    this.setState(s => {
      s.loading = true;
      return s;
    }, () => {
      this.http.request("orgs/showPostings").then(res => {
        console.log(res);
        if (res.ok) return res.json();
        onError(res.statusTExt);
        throw Error(res.statusText);
      }, err => onError(err))
      .then(d => {
        // console.log(d);
        if (d && d.org) {
          this.setState(s => {
            s.jobs.stable = d.stable_jobs;
            s.jobs.quick = d.quick_jobs;
            s.jobs.intern = d.interns;
            s.jobs.project = d.projects;
            s.panelOpen = {
              quick: s.jobs.quick.length > 0,
              stable: s.jobs.stable.length > 0,
              intern: s.jobs.intern.length > 0,
              project: s.jobs.project.length > 0
            };
            s.loading = false;
            s.errorMsg = null;
            return s;
          });
        } else this.props.signOut();
      })
      .catch(err => onError(err));
    });
  }

  togglePanel(type) {
    this.setState(s => {
      s.panelOpen[type] = !s.panelOpen[type];
      return s;
    });
  }

  delete(id) {
    this.http.request('jobs/' + id, "DELETE").then(res => {
      if (res.ok) return res.json();
      return {error: true};
    }).then(d => {
      console.log("logging res.json or res.error");
      console.log(d);
      if (!d.error) this.refresh();
    });
  }

  showJobModal(type = "new", data = null) {
    this.setState(s => {
      s.modal.show = true;
      s.modal.type = type;
      if (!! data) {
        data.langs = data.langs.map(lang => lang.name);
        s.modal.data = data;
      }
      return s;
    });
  }

  closeJobModal(refresh) {
    this.setState(s => {
      s.modal.show = false;
      s.modal.type = "new";
      s.modal.data = null;
      return s;
    }, () => {
      console.log("refresh is " + refresh);
      if (refresh) this.refresh();
    });
  }

  renderTable(jobArr) {
    if (!jobArr || jobArr.length <= 0) return null;
    return jobArr.map(job => {
      const updatedAt = (new Date(job.updated_at).toLocaleDateString());
      let salaryDescription = "";
      switch (job.salary_type) {
        case "range":
          salaryDescription = "$" + job.salary_high + "-" + job.salary_low + " /" + job.salary_unit;
          break;
        case "specific":
          salaryDescription = "$" + job.salary_value + " /" + job.salary_unit;
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
          <td>{job.title}</td>
          <td>{updatedAt}</td>
          <td>{salaryDescription}</td>
          <td>
            <Button
              bsSize="small"
              bsStyle="link"
              onClick={() => { this.showJobModal("edit", job) }}
            >
              Edit
            </Button>
          </td>
          <td>
            <Button
              bsSize="small"
              bsStyle="link"
              onClick={() => { this.delete(job.id); }}
            >
              X
            </Button>
          </td>
        </tr>
      );
    });
  }

  render() {
    if (!!this.state.loading) return (<div className="flex-row flex-vhCenter"><Loading type="bubbles" color="#337ab7" /></div>);
    if (!!this.state.errorMsg) return (<div className="flex-row full-width" style={{minHeight: '50px'}}> this.state.errorMsg </div>);

    return (
      <section className="board">
        <p>You have posted {this.state.jobs.quick.length} quick jobs, {this.state.jobs.stable.length} stable jobs, {this.state.jobs.intern.length} internships, and {this.state.jobs.project.length} projects.</p>
        <div className="flex-col flex-vhCenter">
          <Icon
            name="plus circle"
            size="big"
            link
            className="add"
            onClick={() => { this.showJobModal(); }}
          />
        </div>
        {
          this.vars.jobType.map(obj => ([
            <div className="toggle-div" key={"toggle-div-" + obj.value}>
              <h4 className="inline">{obj.name}s</h4>
              <Button bsStyle="link" onClick={() => { this.togglePanel(obj.value); }}>
                {this.state.panelOpen[obj.value] ? "collapse" : "show" } ({this.state.jobs[obj.value].length})
              </Button>
            </div>,
            <Panel collapsible expanded={this.state.panelOpen[obj.value]} key={"panel-" + obj.value}>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Updated At</th>
                    <th>Salary</th>
                    <th>Show Description</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderTable(this.state.jobs[obj.value])}
                </tbody>
              </Table>
            </Panel>
          ]))
        }

        <JobModal
          show={this.state.modal.show}
          type={this.state.modal.type}
          data={this.state.modal.data}
          closeModal={ (refresh) => { this.closeJobModal(refresh); }}
        />
      </section>
    ); // end render return()
  } // end render
}

Board.propTypes = {
  signOut: React.PropTypes.func.isRequired,
  org: React.PropTypes.any,
  me: React.PropTypes.any
};

export default Board;
