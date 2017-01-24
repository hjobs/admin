import React from 'react';
import { Modal, Button, FormGroup, ControlLabel, HelpBlock, FormControl, Checkbox } from 'react-bootstrap';
import 'whatwg-fetch';

class AddItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      job: {
        title: "",
        description: "",
        attachment_url: "",
        employment_type: [],
        salary_type: "",
        job_type: props.jobType,
        salary: {
          salary_value: "",
          salary_high: "",
          salary_low: ""
        }
      },
      project: {
        title: "",
        description: "",
        attachment_url: "",
        reward_value: ""
      }
    };
  }

  save() {
    let data = this.state[this.props.modalType];
    let url = this.props.baseUrl + this.props.modalType + 's';
    if (this.props.modalType === 'job') { // Post Job
      switch (data.salary_type) {
        case 'specific':
          data.salary_value = data.salary.salary_value;
          break;
        case 'range':
          data.salary_low = data.salary.salary_low;
          data.salary_high = data.salary.salary_high;
          break;
        case 'negotiable': default: break;
      }
      data.salary = null;
      console.log(data);

      // fetch(url, {
      //   method: 'POST',
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: this.props.authToken
      //   },
      //   body: JSON.stringify({job: data})
      // })
      //   .then(res => {
      //     console.log(res);
      //     if (res.status > 300) {
      //       this.setState({errorMessage: res.statusText});
      //       return "error";
      //     } else {
      //       return res.json();
      //     }
      //   })
      //   .then(d => {
      //     console.log(d);
      //     if (d === "error") {
      //       console.log('we caught an error');
      //     } else {
      //       this.props.closeModal(true);
      //     }
      //   });
    } else { // Post Project

    }
    const body = {};
    body[this.props.modalType] = data;
    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: this.props.authToken
      },
      body: JSON.stringify(body)
    })
      .then(res => {
        console.log(res);
        if (res.status > 300) {
          this.setState({errorMessage: res.statusText});
          return "error";
        } else {
          return res.json();
        }
      })
      .then(d => {
        console.log(d);
        if (d === "error") {
          console.log('we caught an error');
        } else {
          this.props.closeModal(true);
        }
      });
  }

  changeEmploymentType(value) {
    console.log("changeEmploymentType, valu = " + value);
    const arr =
      (!this.state[this.props.modalType] || !this.state[this.props.modalType].employment_types) ?
        [] :
        this.state[this.props.modalType].employment_types;
    const index = arr.indexOf(value);
    if (index === -1) {
      arr.push(value);
    } else {
      arr.splice(index,1);
    }
    this.handleFormChange("employment_types", arr);
    // console.log(document.getElementById('job-employment_type').value);
  }

  handleFormChange(id, value) {
    // console.log('logging ' + id + ' event, and event = ');
    // console.log(value);
    const idArr = id.split(":");
    let data = this.state[this.props.modalType];
    let ref = data;
    idArr.forEach((key, index, arr) => {
      if (index < (arr.length - 1)) ref = data[key];
    });
    // console.log(ref);
    ref[idArr[idArr.length - 1]] = value;
    // console.log("logging ref: ");
    // console.log(ref);
    // console.log("logging data: ");
    // console.log(data);
    
    // data[this.props.modalType][id] = value;
    // this.setState(data);
    const nextState = {};
    nextState[this.props.modalType] = data;
    this.setState(nextState, () => { console.log("logging this.state"); console.log(this.state); });
  }

  render() {
    const fieldGroup = ({id, label, help, type, placeholder, props}) => {
      const idArr = id.split(":");
      let value = this.state[this.props.modalType];
      idArr.forEach(key => {
        value = value[key];
      });
      // console.log("fieldGroup logging id of: " + id + ", where value = " + value);
      return (
        <FormGroup controlId={id}>
          {label ? <ControlLabel>{label}</ControlLabel> : null}
          {
            type !== "textarea" ?
              <FormControl
                value={value}
                {...props}
                placeholder={placeholder}
                type={type}
                onChange={(event) => { this.handleFormChange(id, event.target.value); }} />
              :
              <FormControl
                componentClass={type}
                value={value}
                onChange={(event) => { this.handleFormChange(id, event.target.value); }} />
          }
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
      );
    };
    const jobSalaryValue = () => {
      switch (this.state[this.props.modalType].salary_type) {
        case 'specific': default:
          return (
            fieldGroup({
              id: "salary:salary_value",
              type: "number",
              label: "Salary Value ($)"
            })
          );
        case 'range':
          return (
            <div>
              { fieldGroup({
                id: "salary:salary_low",
                type: "number",
                label: "From($)"
              })}
              { fieldGroup({
                id: "salary:salary_high",
                type: "number",
                label: "To($$$)"
              })}
            </div>
          );
        case 'negotiable':
          return null;
      }
    };
    const checkbox = ({id, label, help, itemArr}) => {
      return (
        <FormGroup>
          { label ? <ControlLabel>{label}</ControlLabel> : null }
          {' '}
          {
            itemArr.map(item =>
              <Checkbox
                key={this.props.modalType + "_" + id + "_" + item.value}
                onClick={() => { this.changeEmploymentType(item.value); }} inline>
                {item.name} {' '}
              </Checkbox>
            )
          }
          {help}
        </FormGroup>
      );
    };

    return this.props.show ? (
      <Modal
        show={this.props.show}
        dialogClassName="addItemModal"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-lg">
            Add a {this.props.jobType === "casual" ? "Casual" : "Stable"} {this.props.modalType === 'job' ? 'Job' : 'Project'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            this.props.modalType === 'job' ?
              (
                <div className="job">
                  { fieldGroup({
                    id: "title",
                    label: "Job Title",
                    type: "text",
                    help: "Recommended to specify position here to capture attention"
                  })}

                  { fieldGroup({
                    id: "description",
                    label: "Description",
                    type: "textarea",
                    help: "This will be shown on the website showing details and important information about the job that you think potential canditdates should know."
                  })}

                  <FormGroup>
                    <ControlLabel>Salary Type</ControlLabel>
                    <select onChange={(event) => { this.handleFormChange('salary_type', event.target.value); }} className="form-control" id="salary_type" >
                      <option value="specific">Specific</option>
                      <option value="range">Range</option>
                      <option value="negotiable">Negotiable</option>
                    </select>
                  </FormGroup>

                  { jobSalaryValue() }

                  {checkbox({
                    id: "employmentType",
                    label: "Employment Type",
                    itemArr: [
                      {value: "fulltime", name: "Full-Time"},
                      {value: "parttime", name: "Part-Time"}
                    ]
                  })}

                  { fieldGroup({
                    id: "attachment_url",
                    label: "Attachment Link (Dropbox)",
                    type: "text",
                    help: "Feel free to attach a dropbox link to showcase further information in beautiful PDFs and documents!"
                  })}
                </div>
              )
              :
              (
                <div className="job">
                  { fieldGroup({
                    id: "title",
                    label: "Project Title",
                    type: "text",
                    help: "Recommended to specify position here to capture attention"
                  })}

                  { fieldGroup({
                    id: "description",
                    label: "Description",
                    type: "textarea",
                    help: "This will be shown on the website showing details and important information about the job that you think potential canditdates should know."
                  })}

                  { fieldGroup({
                    id: "reward",
                    label: "Reward",
                    type: "text",
                    help: "Let potential talents know what kind of reward you offer. Is it cash, certification or some other reward?"
                  })}

                  { fieldGroup({
                    id: "attachment_url",
                    label: "Attachment Link (Dropbox)",
                    type: "text",
                    help: "Feel free to attach a dropbox link to showcase further information in beautiful PDFs and documents!"
                  })}
                </div>
              )
          }
        </Modal.Body>
        <Modal.Footer>
          <Button
            bsStyle="danger"
            onClick={() => { this.props.closeModal(false); }} >
            Cancel
          </Button>
          <Button
            bsStyle="success"
            onClick={() => { this.save(); }} >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    ) : null;
  }
}

AddItemModal.propTypes = {
  authToken: React.PropTypes.string.isRequired,
  baseUrl: React.PropTypes.string.isRequired,
  closeModal: React.PropTypes.func.isRequired,
  show: React.PropTypes.bool.isRequired,
  modalType: React.PropTypes.string.isRequired,
  jobType: React.PropTypes.string
};

export default AddItemModal;
