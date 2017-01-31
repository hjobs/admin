import React from 'react';
import { Button, Panel, Table } from 'react-bootstrap';
import 'whatwg-fetch';
let Loading = require('react-loading');

// import Job from './Job';
import AddItemModal from './AddItemModal';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openProjectPanel: false,
      showAddItemModal: false,
      addItemModalType: null,
      addItemJobType: null,
      panelOpen: {
        casual: false,
        stable: false,
        projects: false
      },
      loading: true
    };
  }

  componentWillMount() {
    const url = this.props.baseUrl + 'orgs/showPostings';
    fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: this.props.authToken
      }
    })
      .then(res => {
        // console.log(res);
        if (res.ok) {
          return res.json();
        } else {
          localStorage.removeItem("authToken");
          alert('Thre is an error with the login, if problem persists, please contact administrators.');
          this.setState({loading: false});
        }
      })
      .then(d => {
        // console.log(d);
        if (d.org) {
          let obj = {};
          obj.stableJobs = d.stable_jobs;
          obj.casualJobs = d.casual_jobs;
          obj.projects = d.projects;
          obj.loading = false;
          this.setState(obj, () => {
            // console.log("app.js loadData is called, setState, will log this.state");
            // console.log(this.state);
          });
        } else {
          localStorage.removeItem("authToken");
          this.setState({loading: false});
        }
      });
  }

  showDescription(object) {
    console.log(object);
    window.alert(object.description);
  }

  togglePanel(type) {
    const obj = {};
    obj.panelOpen = this.state.panelOpen;
    obj.panelOpen[type] = !obj.panelOpen[type];
    this.setState(obj);
  }

  delete(dataType, id) {
    const url = this.props.baseUrl + dataType + 's/' + id;
    fetch(url, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: this.props.authToken
      }
    }).then(res => {
      if (res.ok) return res.json();
      return {error: true};
    }).then(d => {
      console.log("logging res.json or res.error");
      console.log(d);
      if (!d.error) this.props.refresh();
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
      if (refresh) this.props.refresh();
    });
  }

  edit(data) {
    console.log("inside board.js edit(), and logging data...")
    console.log(data);
  }

  render() {
    let casualJobsTable, stableJobsTable, projectsTable;
    if (!this.state.loading) {
      casualJobsTable = this.state.casualJobs.map(data => {
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
                onClick={() => { this.delete('job', data.id); }}
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
                onClick={() => { this.delete('job', data.id); }}
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
                onClick={() => { this.delete('project', data.id); }}
              >
                X
              </Button>
            </td>
          </tr>
        );
      });
    }

    return this.state.loading ? <div className="flex-row flex-vhCenter"><Loading type='bubbles' color='#337ab7' /></div> : (
      <section className="board">
        <p>You have posted {this.state.casualJobs.length} casual jobs, {this.state.stableJobs.length} stable jobs, and {this.state.projects.length} projects.</p>
        
        <div className="toggle-div">
          <h4 className="inline">Casual Jobs</h4>
          <Button bsStyle="link" onClick={() => { this.togglePanel('casual'); }}>
            {this.state.panelOpen.casual ? "collapse" : "show" } ({this.state.casualJobs.length})
          </Button>
          <div className="flex-col flex-vhCenter">
            <Button
              bsStyle="primary"
              bsSize="small"
              className="add"
              onClick={() => { this.showAddItemModal('job','casual'); }}> + </Button>
          </div>
        </div>
        <Panel collapsible expanded={this.state.panelOpen.casual}>
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
              {casualJobsTable}
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
          <Button bsStyle="link" onClick={() => { this.togglePanel('projects') }}>
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

        {
          this.state.showAddItemModal ?
            <AddItemModal
              authToken={this.props.authToken}
              baseUrl={this.props.baseUrl}
              show={this.state.showAddItemModal}
              modalType={this.state.addItemModalType}
              jobType={this.state.addItemJobType}
              closeModal={ (refresh) => { this.closeAddItemModal(refresh); }}
            />
            : null
        }
      </section>
    );
  }
}

Board.propTypes = {
  authToken: React.PropTypes.string,
  baseUrl: React.PropTypes.string,
  org: React.PropTypes.any,
  me: React.PropTypes.any
};

export default Board;
