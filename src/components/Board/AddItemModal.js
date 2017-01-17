import React from 'react';
import { Modal, Button, FormGroup, ControlLabel, HelpBlock, FormControl } from 'react-bootstrap';
import 'whatwg-fetch';

class AddItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobSalaryType: 'specific'
    };
  }

  save() {
    if (this.props.modalType === 'job') { // Post Job
      let data = {};
      data.title = document.getElementById("job-title").value;
      data.description = document.getElementById("job-description").value;
      data.salary_type = document.getElementById("job-salary_type").value;
      data.attachment_url = document.getElementById("job-attachment_url").value;
      switch (data.salary_type) {
        case 'specific':
          data.salary_value = document.getElementById("job-salary_value").value;
          break;
        case 'range':
          data.salary_high = document.getElementById("job-salary_high").value;
          data.salary_low = document.getElementById("job-salary_low").value;
          break;
        case 'negotiable': default: break;
      }
      console.log(data);

      const url = this.props.baseUrl + 'jobs';

      fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: this.props.authToken
        },
        body: {job: data}
      })
        .then(res => {
          console.log(res);
          if (res.status > 300) {
            return "error";
          } else {
            return res.json();
          }
        })
        .then(d => {
          console.log(d);
        });

    } else { // Post Project

    }
  }

  changeSalaryType() {
    const option = document.getElementById('job-salary_type').value;
    this.setState({jobSalaryType: option});
  }

  render() {
    function FieldGroup({ id, label, help, type, placeholder, props }) {
      return (
        <FormGroup controlId={id}>
          {label ? <ControlLabel>{label}</ControlLabel> : null}
          <FormControl {...props} placeholder={placeholder} type={type} />
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
      );
    }

    const jobSalaryValue = () => {
      switch (this.state.jobSalaryType) {
        case 'specific': default:
          return (
            <FieldGroup
              id="job-salary_value"
              type="number"
              label="Salary Value ($)"
            />
          );
        case 'range':
          return (
            <div>
              <FieldGroup
                id="job-salary_low"
                type="number"
                label="From($)"
              />
              <FieldGroup
                id="job-salary_high"
                type="number"
                label="To($$$)"
              />
            </div>
          );
        case 'negotiable':
          return null;
      }
    };
    // console.log("ApplyModal this.props.shown = " + this.props.shown);
    return (
      <Modal
        show={this.props.show}
        dialogClassName="addItemModal"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-lg">
            Add a {this.props.modalType === 'job' ? 'Job' : 'Project'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            this.props.modalType === 'job' ?
              (
                <div className="job">
                  <FieldGroup
                    id="job-title"
                    label="Job Title"
                    type="text"
                    help="Recommended to specify position here to capture attention"
                  />

                  <FormGroup controlId="job-description">
                    <ControlLabel>Description</ControlLabel>
                    <FormControl componentClass="textarea" />
                    <HelpBlock>This will be shown on the website showing details and important information about the job that you think potential canditdates should know.</HelpBlock>
                  </FormGroup>

                  <FormGroup>
                    <ControlLabel>Salary Type</ControlLabel>
                    <select onChange={() => { this.changeSalaryType(); }} className="form-control" id="job-salary_type" >
                      <option value="specific">Specific</option>
                      <option value="range">Range</option>
                      <option value="negotiable">Negotiable</option>
                    </select>
                  </FormGroup>

                  {jobSalaryValue()}

                  <FieldGroup
                    id="job-attachment_url"
                    label="Attachment Link (Dropbox)"
                    type="text"
                    help="Feel free to attach a dropbox link to showcase further information in beautiful PDFs and documents!"
                  />
                </div>
              )
              :
              (
                <div>

                </div>
              )
          }
        </Modal.Body>
        <Modal.Footer>
          <Button
            bsStyle="danger"
            onClick={() => { this.props.closeModal(); }} >
            Close
          </Button>
          <Button
            bsStyle="success"
            onClick={() => { this.save(); }} >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

AddItemModal.propTypes = {
  authToken: React.PropTypes.string.isRequired,
  baseUrl: React.PropTypes.string.isRequired,
  closeModal: React.PropTypes.func.isRequired,
  show: React.PropTypes.bool.isRequired,
  modalType: React.PropTypes.string.isRequired
};

export default AddItemModal;
