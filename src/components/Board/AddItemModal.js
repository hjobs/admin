import React from 'react';
// import { Modal, Button, FormGroup, ControlLabel, HelpBlock, FormControl, Checkbox } from 'react-bootstrap';
import { Form, Button, Input, Dropdown } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';
import 'whatwg-fetch';

// import Variable from '../../services/var';
import Http from '../../services/http';

const salaryOptions = [
  {key: "range", text: "range", value: "range"},
  {key: "specific", text: "specific", value: "specific"},
  {key: "negotiable", text: "negotiable", value: "negotiable"}
];

class AddItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      job: {
        title: "",
        description: "",
        attachment_url: "",
        employment_type: [],
        job_type: props.jobType,
        salary_type: "",
        salary_value: "",
        salary_high: "",
        salary_low: ""
      },
      loading: false
    };
    this.http = new Http();
  }

  /*
  attachment_url
  deadline: datetime
  description: text
  job_type: integer
  position: string

  reward_type (salary_type: string)
  reward_high (salary_high: integer)
  reward_low (salary_low: integer)
  reward_value (salary_value: text)
  */

  save() {
    this.setState(s => { s.loading = true; }, () => {
      this.http.request('jobs', "POST", {jobs: this.state.job}).then(res => {
        console.log(res);
        if (!res.ok) return this.setState(s => { s.loading = false; s.errorMessage = res.statusText; return s; });
        return res.json();
      })
      .then(d => {
        if (!d) return;
        this.setState(s => { s.loading = false; s.errorMessage = null; return s; }, () => {
          this.props.closeModal(true);
        });
      });
    });
  }

  changeEmploymentType(value) {
    console.log("changeEmploymentType, valu = " + value);
    const arr =
      (!this.state[this.props.modalType] || !this.state[this.props.modalType].employment_types) ?
        [] :
        this.state[this.props.modalType].employment_types;
    const index = arr.indexOf(value);
    if (index === -1) arr.push(value);
    else arr.splice(index,1);
    this.handleFormChange("employment_types", arr);
    // console.log(document.getElementById('job-employment_type').value);
  }

  /** @param {string} value @param {'title'|'description'|'attachment_url'|'employment_type'|'salary_type'|'salary_high'|'salary_low'|'salary_value'} key */
  handleFormChange(key, value) {
    this.setState(s => {
      s.job[key] = value;
      return s;
    });
  }

  [{name: "title"}, {name: "description"}, {name: "attachment_url"}];

  render() {
    if (!this.props.show) return null;
    return (
      <Modal show={this.props.show} dialogClassName="addItemModal" keyboard={false} backdrop="static">
        <Modal.Body>
          Add a {this.props.jobType ? this.props.jobType : null}
          <Form loading={this.state.loading} onSubmit={(e, data) => { e.preventDefault(); console.log([e, data]); }} >
            <Form.Input
              name="Title"
              label="Title" inline
              onChange={(e) => { this.handleFormChange("title", e.target.value); }}
              type="text"
            />
            <Form.Input
              name="Description"
              label="Description" inline
              onChange={(e) => { this.handleFormChange("title", e.target.value); }}
              type="text"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="orange"
            onClick={() => { this.props.closeModal(false); }} >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={() => { this.save(); }} >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
    // const fieldGroup = ({id, label, help, type, placeholder, props}) => {
    //   const idArr = id.split(":");
    //   let value = this.state[this.props.modalType];
    //   idArr.forEach(key => {
    //     value = value[key];
    //   });
    //   // console.log("fieldGroup logging id of: " + id + ", where value = " + value);
    //   return (
    //     <FormGroup controlId={id}>
    //       {label ? <ControlLabel>{label}</ControlLabel> : null}
    //       {
    //         type !== "textarea" ?
    //           <FormControl
    //             value={value}
    //             {...props}
    //             placeholder={placeholder}
    //             type={type}
    //             onChange={(event) => { this.handleFormChange(id, event.target.value); }} />
    //           :
    //           <FormControl
    //             componentClass={type}
    //             value={value}
    //             onChange={(event) => { this.handleFormChange(id, event.target.value); }} />
    //       }
    //       {help && <HelpBlock>{help}</HelpBlock>}
    //     </FormGroup>
    //   );
    // };
    // const jobSalaryValue = () => {
    //   switch (this.state[this.props.modalType].salary_type) {
    //     case 'specific': default:
    //       return (
    //         fieldGroup({
    //           id: "salary:salary_value",
    //           type: "number",
    //           label: "Salary Value ($)"
    //         })
    //       );
    //     case 'range':
    //       return (
    //         <div>
    //           { fieldGroup({
    //             id: "salary:salary_low",
    //             type: "number",
    //             label: "From($)"
    //           })}
    //           { fieldGroup({
    //             id: "salary:salary_high",
    //             type: "number",
    //             label: "To($$$)"
    //           })}
    //         </div>
    //       );
    //     case 'negotiable':
    //       return null;
    //   }
    // };
    // const checkbox = ({id, label, help, itemArr}) => {
    //   return (
    //     <FormGroup>
    //       { label ? <ControlLabel>{label}</ControlLabel> : null }
    //       {' '}
    //       {
    //         itemArr.map(item =>
    //           <Checkbox
    //             key={this.props.modalType + "_" + id + "_" + item.value}
    //             onClick={() => { this.changeEmploymentType(item.value); }} inline>
    //             {item.name} {' '}
    //           </Checkbox>
    //         )
    //       }
    //       {help}
    //     </FormGroup>
    //   );
    // };


    //       {
    //         this.props.modalType === 'job' ?
    //           (
    //             <div className="job">
    //               { fieldGroup({
    //                 id: "title",
    //                 label: "Job Title",
    //                 type: "text",
    //                 help: "Recommended to specify position here to capture attention"
    //               })}

    //               { fieldGroup({
    //                 id: "description",
    //                 label: "Description",
    //                 type: "textarea",
    //                 help: "This will be shown on the website showing details and important information about the job that you think potential canditdates should know."
    //               })}

    //               <FormGroup>
    //                 <ControlLabel>Salary Type</ControlLabel>
    //                 <select onChange={(event) => { this.handleFormChange('salary_type', event.target.value); }} className="form-control" id="salary_type" >
    //                   <option value="specific">Specific</option>
    //                   <option value="range">Range</option>
    //                   <option value="negotiable">Negotiable</option>
    //                 </select>
    //               </FormGroup>

    //               { jobSalaryValue() }

    //               { this.props.jobType === 'casual' ? null : checkbox({
    //                 id: "employmentType",
    //                 label: "Employment Type",
    //                 itemArr: [
    //                   {value: "fulltime", name: "Full-Time"},
    //                   {value: "parttime", name: "Part-Time"}
    //                 ]
    //               })}

    //               { fieldGroup({
    //                 id: "attachment_url",
    //                 label: "Attachment Link (Dropbox)",
    //                 type: "text",
    //                 help: "Feel free to attach a dropbox link to showcase further information in beautiful PDFs and documents!"
    //               })}
    //             </div>
    //           )
    //           :
    //           (
    //             <div className="job">
    //               { fieldGroup({
    //                 id: "title",
    //                 label: "Project Title",
    //                 type: "text",
    //                 help: "Recommended to specify position here to capture attention"
    //               })}

    //               { fieldGroup({
    //                 id: "description",
    //                 label: "Description",
    //                 type: "textarea",
    //                 help: "This will be shown on the website showing details and important information about the job that you think potential canditdates should know."
    //               })}

    //               { fieldGroup({
    //                 id: "reward",
    //                 label: "Reward",
    //                 type: "text",
    //                 help: "Let potential talents know what kind of reward you offer. Is it cash, certification or some other reward?"
    //               })}

    //               { fieldGroup({
    //                 id: "attachment_url",
    //                 label: "Attachment Link (Dropbox)",
    //                 type: "text",
    //                 help: "Feel free to attach a dropbox link to showcase further information in beautiful PDFs and documents!"
    //               })}
    //             </div>
    //           )
    //       }
  }
}

AddItemModal.propTypes = {
  closeModal: React.PropTypes.func.isRequired,
  show: React.PropTypes.bool.isRequired,
  jobType: React.PropTypes.string
};

export default AddItemModal;
