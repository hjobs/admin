import Flatpickr from 'react-flatpickr';
import React from 'react';
import { Button, Panel, Table } from 'react-bootstrap';
import 'whatwg-fetch';
let Loading = require('react-loading');

// import Job from './Job';
import AddItemModal from '../AddItemModal/AddItemModal';

// import Variable from '../../services/var';
import Http from '../../services/http';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openProjectPanel: false,
      showAddItemModal: false,
      addItemModalType: null,
      addItemJobType: null,
      panelOpen: {
        quick: true,
        stable: true,
        projects: true
      },
      loading: true,
      quickJobs: null,
      stableJobs: null,
      internships: null,
      projects: null,
      errorMsg: null
    };
    console.log(["Board constructor called"]);
    this.http = new Http();
  }

  componentWillMount() {
    this.refresh();
  }

  refresh() {
    const onError = (err) => {
      this.setState(s => {
        s.loading = false;
        s.errorMsg = err;
        return s;
      });
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
            s.stableJobs = d.stable_jobs;
            s.quickJobs = d.quick_jobs;
            s.internships = d.internships;
            s.projects = d.projects;
            s.loading = false;
            return s;
          });
        } else this.props.signOut();
      })
      .catch(err => onError(err));
    });
  }

  showDescription(object) {
    console.log(object);
    if (!!object) alert(object.description);
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

  showAddItemModal(modalType, jobType) {
    this.setState({
      addItemModalType: modalType,
      addItemJobType: jobType,
      showAddItemModal: true
    });
  }

  closeAddItemModal(refresh) {
    this.setState({
      showAddItemModal: false,
      addItemModalType: null
    }, () => {
      console.log("refresh is " + refresh);
      if (refresh) this.refresh();
    });
  }

  edit(data) {
    console.log("inside board.js edit(), and logging data...");
    console.log(data);
  }

  render() {
    if (!!this.state.loading) return (<div className="flex-row flex-vhCenter"><Loading type="bubbles" color="#337ab7" /></div>);
    if (!!this.state.errorMsg) return (<div className="flex-row full-width" style={{minHeight: '50px'}}> this.state.errorMsg </div>);
    let quickJobsTable, stableJobsTable, projectsTable;
    if (!this.state.loading && !this.state.errorMsg) {
      quickJobsTable = this.state.quickJobs.map(data => {
        const updatedAt = (new Date(data.updated_at).toLocaleDateString());
        let salaryDescription = "";
        switch (data.salary_type) {
          case "range":
            salaryDescription = "range = $" + data.salary_high + " to $" + data.salary_low;
            break;
          case "specific":
            salaryDescription = "specific: $" + data.salary_value;
            break;
          case "negotiable": default:
            salaryDescription = "negotiable";
            break;
        }
        return (
          <tr key={"jobs_long_" + data.id} >
            <td>{data.title}</td>
            <td>{updatedAt}</td>
            <td>{salaryDescription}</td>
            <td>
              <Button
                bsSize="small"
                bsStyle="link"
                onClick={() => { this.edit(data); }}
              >
                Edit
              </Button>
            </td>
            <td>
              <Button
                bsSize="small"
                bsStyle="link"
                onClick={() => { this.delete(data.id); }}
              >
                X
              </Button>
            </td>
          </tr>
        );
      });

      stableJobsTable = this.state.stableJobs.map(data => {
        const updatedAt = (new Date(data.updated_at).toLocaleDateString());
        let salaryDescription = "";
        switch (data.salary_type) {
          case "range":
            salaryDescription = "range = $" + data.salary_high + " to $" + data.salary_low;
            break;
          case "specific":
            salaryDescription = "specific: $" + data.salary_value;
            break;
          case "negotiable": default:
            salaryDescription = "negotiable";
            break;
        }
        return (
          <tr key={"jobs_long_" + data.id} >
            <td>{data.title}</td>
            <td>{updatedAt}</td>
            <td>{salaryDescription}</td>
            <td>
              <Button
                bsSize="small"
                bsStyle="link"
                onClick={() => { this.edit(data); }}
              >
                Edit
              </Button>
            </td>
            <td>
              <Button
                bsSize="small"
                bsStyle="link"
                onClick={() => { this.delete(data.id); }}
              >
                X
              </Button>
            </td>
          </tr>
        );
      });

      projectsTable = this.state.projects.map(data => {
        const updatedAt = (new Date(data.updated_at).toLocaleDateString());
        return (
          <tr key={"jobs_long_" + data.id} >
            <td>{data.title}</td>
            <td>{updatedAt}</td>
            <td>{data.reward_value}</td>
            <td>
              <Button
                bsSize="small"
                bsStyle="link"
                onClick={() => { this.edit(data); }}
              >
                Edit
              </Button>
            </td>
            <td>
              <Button
                bsSize="small"
                bsStyle="link"
                onClick={() => { this.delete(data.id); }}
              >
                X
              </Button>
            </td>
          </tr>
        );
      });
    }

    return (
      <section className="board">
        <p>You have posted {this.state.quickJobs.length} quick jobs, {this.state.stableJobs.length} stable jobs, and {this.state.projects.length} projects.</p>
        <Flatpickr
          options={{
            enableTime: true,
            utc: true,
            minDate: new Date(),
            noCalendar: true,
            time_24hr: true,
            disableMobile: false
          }}
          onChange={v => console.info(v)}
        />
        <Flatpickr
          options={{
            mode: "multiple",
            utc: true,
            minDate: new Date(),
            altInput: true,
            altFormat: "F j"
          }}
          onChange={v => console.info(v)}
        />
        <div className="toggle-div">
          <h4 className="inline">Quick Jobs</h4>
          <Button bsStyle="link" onClick={() => { this.togglePanel('quick'); }}>
            {this.state.panelOpen.quick ? "collapse" : "show" } ({this.state.quickJobs.length})
          </Button>
          <div className="flex-col flex-vhCenter">
            <Button
              bsStyle="primary"
              bsSize="small"
              className="add"
              onClick={() => { this.showAddItemModal('job','quick'); }}> + </Button>
          </div>
        </div>
        <Panel collapsible expanded={this.state.panelOpen.quick}>
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
              {quickJobsTable}
            </tbody>
          </Table>
        </Panel>

        <div className="toggle-div">
          <h4 className="inline">Stable Jobs</h4>
          <Button bsStyle="link" onClick={() => { this.togglePanel('stable') }}>
            {this.state.panelOpen.stable ? "collapse" : "show" } ({this.state.stableJobs.length})
          </Button>
          <div className="flex-col flex-vhCenter">
            <Button
              bsStyle="primary"
              bsSize="small"
              className="add"
              onClick={() => { this.showAddItemModal('job','stable'); }}> + </Button>
          </div>
        </div>
        <Panel collapsible expanded={this.state.panelOpen.stable}>
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
              {stableJobsTable}
            </tbody>
          </Table>
        </Panel>

        <div className="toggle-div">
          <h4 className="inline">Projects</h4>
          <Button bsStyle="link" onClick={() => { this.togglePanel('projects'); }}>
            {this.state.panelOpen.projects ? "collapse" : "show" } ({this.state.projects.length})
          </Button>
          <div className="flex-col flex-vhCenter">
            <Button
              bsStyle="primary"
              bsSize="small"
              className="add"
              onClick={() => { this.showAddItemModal('project'); }}> + </Button>
          </div>
        </div>
        <Panel collapsible expanded={this.state.panelOpen.projects}>
          <Table responsive striped>
            <thead>
              <tr>
                <th>Title</th>
                <th>Updated at</th>
                <th>Reward</th>
                <th>Show Description</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {projectsTable}
            </tbody>
          </Table>
        </Panel>

        <AddItemModal
          show={this.state.showAddItemModal}
          modalType={this.state.addItemModalType}
          jobType={this.state.addItemJobType}
          closeModal={ (refresh) => { this.closeAddItemModal(refresh); }}
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
