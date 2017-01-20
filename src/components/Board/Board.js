import React from 'react';
import { Button, Panel, Table } from 'react-bootstrap';
// import 'whatwg-fetch';
// let Loading = require('react-loading');

// import Job from './Job';
import AddItemModal from './AddItemModal';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openJobPanel: false,
      openProjectPanel: false,
      showAddItemModal: false,
      addItemModalType: null
    };
  }

  showDescription(value) {
    console.log(value);
  }

  delete(dataType, id) {
    const url = this.props.baseUrl + 'jobs/' + id;
    fetch(url, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: this.props.authToken
      }
    });
    return "job" || "project";
  }

  showAddItemModal(modalType) {
    this.setState({
      addItemModalType: modalType,
      showAddItemModal: true
    });
  }

  closeAddItemModal() {
    this.setState({
      showAddItemModal: false,
      addItemModalType: null
    });
  }

  render() {
    let jobsTable = this.props.jobs.map(data => {
      const createdAt = (new Date(data.created_at).toLocaleDateString());
      // .toUTCString().slice(5,16));
      // const deadline = (new Date(data.deadline)).toUTCString().slice(5,16);
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
        <tr>
          <td>{data.title}</td>
          <td>{createdAt}</td>
          <td>{salaryDescription}</td>
          <td>
            <Button
              bsSize="small"
              bsStyle="link"
              onClick={() => { this.showDescription(data.description); }}
            >
              Show
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

    return (
      <section className="board">
        <p>You have posted {this.props.jobs.length} jobs and {this.props.projects.length} projects.</p>
        <div className="toggle-div">
          <h3 className="inline">Jobs</h3>
          <Button bsStyle="link" onClick={() => this.setState({openJobPanel: !this.state.openJobPanel}) }>
            {this.state.openJobPanel ? "collapse jobs" : "show jobs" } ({this.props.jobs.length})
          </Button>
        </div>
        <Panel collapsible expanded={this.state.openJobPanel}>
          <div className="flex-col flex-vhCenter">
            <Button
              bsStyle="primary"
              bsSize="small"
              className="add"
              onClick={() => { this.showAddItemModal('job'); }}> + </Button>
          </div>
          <Table responsive striped>
            <thead>
              <tr>
                <th>Title</th>
                <th>Post Date</th>
                <th>Salary</th>
                <th>Show Description</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {jobsTable}
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
              closeModal={() => { this.closeAddItemModal(); }}
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
  employer: React.PropTypes.any,
  jobs: React.PropTypes.any,
  projects: React.PropTypes.any
};

export default Board;

/*
const data = [
  {
    imgSrc: 'http://placehold.it/150x150',
    title: 'Job Title Here',
    name: 'HotelName Here',
    date: new Date(1479095519606)
  },
  {
    imgSrc: 'http://placehold.it/150x150',
    title: 'Job Title Here',
    name: 'HotelName Here \n HotelName Here a;sdlkfjas;ldkfjas;dlkfjas;dlfkajsd;lfkasjdf',
    date: new Date(1479095519606)
  },
  {
    imgSrc: 'http://placehold.it/150x150',
    title: 'Job Title Here',
    name: 'HotelName Here',
    date: new Date(1479095519606)
  },
  {
    imgSrc: 'http://placehold.it/150x150',
    title: 'Job Title Here',
    name: 'HotelName Here',
    date: new Date(1479095519606)
  },
  {
    imgSrc: 'http://placehold.it/150x150',
    title: 'Job Title Here',
    name: 'HotelName Here',
    date: new Date(1479095519606)
  },
  {
    imgSrc: 'http://placehold.it/150x150',
    title: 'Job Title Here',
    name: 'HotelName Here',
    date: new Date(1479095519606)
  }
];
*/

    // let dataArr = data.map((datum, i) => {
    //   return (
    //     <div className="col-xs-24 col-sm-12" key={i}>
    //       <Job
    //         imgSrc={datum.imgSrc} title={datum.title}
    //         name={datum.name} date={datum.date}
    //         applyJob={ (jobNo) => { this.openModal(jobNo); } } jobNo={i} />
    //     </div>
    //   );
    // });

// <Job imgSrc={data[i].imgSrc} title={data[i].title} name={data[i].name} date={data[i].date} applyJob={this.applyJob.bind((data[i]))} key={i} />
//

        // <div className="col-sm-12 col-md-6" >
        //   <Job imgSrc={data[i + 1].imgSrc} title={data[i + 1].title} name={data[i + 1].name} date={data[i + 1].date} applyJob={this.applyJob.bind((data[i + 1]))} key={i + 1} />
        // </div>
