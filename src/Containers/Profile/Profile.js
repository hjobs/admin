import React from 'react';
import Reflux from 'reflux';
import S3 from 'aws-sdk/clients/s3';
import { Button, Grid, Row, Col, Image, ListGroup, ListGroupItem, Modal, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { Dimmer, Loader } from 'semantic-ui-react';
let Loading = require('react-loading');
// import Themes from '../../styles/theme';

import Field from './Field';
import Locations from '../../Components/Misc/Locations';
import FileInput from '../../Components/Misc/FileInput';
import SuccessFade from '../../Components/Misc/SuccessFade';

import UserStore, { UserActions } from '../../stores/userStore';

import { yyyymmddhhmmss } from "../../services/var";
import { request } from "../../services/http";
import { checkError, s3DefaultObject, deletePhoto } from '../../services/upload';

class Profile extends Reflux.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      successShown: false,
      editTarget: null,
      showModal: false,
      addAdminData: {
        name: "",
        email: "",
        password: "",
        admin: false
      }
    };
    this.store = UserStore;
    this.s3 = new S3(s3DefaultObject);
  }

  handleSubmit({key, data}) {
    /** quick hack to refresh edits */
    console.log(["key and data in handleSubmit profile.js", key, data])
    const userObj = {};
    if (key.length > 1) {
      userObj[key[0]] = this.state[key[0]];
      userObj[key[0]][key[1]] = data;
    } else {
      userObj[key[0]] = data;
    }
    UserActions.setUser(userObj);
    /** success popup */
    const obj = {editTarget: null, successShown: true};
    this.setState(obj, () => {
      window.setTimeout(() => { this.setState({successShown: false}); }, 2000);
    });
  }

  toggleEdit(val) {
    this.setState({editTarget: val === this.state.editTarget ? null : val});
  }

  toggleAddAdminModal() {
    const obj = {showModal: !this.state.showModal};
    if (this.state.showModal) {
      obj.addAdminData = {
        name: "",
        email: "",
        password: "",
        admin: false
      };
    }
    this.setState(obj);
  }

  handleAddAdminFormChange(key, data) {
    const obj = { addAdminData: this.state.addAdminData };
    obj.addAdminData[key] = data;
    this.setState(obj
      , () => { console.log(this.state); }
    );
  }

  toggleAddAdminCheckbox() {
    const obj = {addAdminData: this.state.addAdminData};
    obj.addAdminData.admin = !obj.addAdminData.admin;
    this.setState(obj);
  }

  submitAddEmployer() {
    const data = {employer: this.state.addAdminData};
    data.employer.org_id = this.state.org.id;
    request("employers", "POST", data).then(res => {
      if (res.ok) return res.json();
      return {error: res.statusText};
    })
    .then(d => {
      const obj = {};
      if (!!d && !d.error) {
        obj.employers = this.state.employers;
        obj.employers.push(d);
        obj.showModal = false;
        obj.modalErrorMsg = null;
        obj.addAdminData = {name: '', email: '', password: '', admin: false};
        this.setState(obj);
      } else {
        obj.modalErrorMsg = d.error;
        this.setState(obj);
      }
    });
  }

  deleteEmployer(employer) {
    request("employers/" + employer.id, "DELETE").then(res => {
      if (res.ok) return {error: null};
      return {error: res.statusText};
    })
    .then(d => {
      const obj = {};
      if (!!d && !d.error) {
        obj.employers = this.state.employers;
        const index = obj.employers.indexOf(employer);
        console.log("deleting local data, index is" + index);
        obj.employers.splice(index, 1);
        this.setState(obj);
      } else {
        obj.modalErrorMsg = d.error;
        this.setState(obj);
      }
    });
  }

  render() {
    const generateField = ({identity, title, description, helpText, optional, hideValue}) => {
      // identity = keyState[.deepKeyState]-keyUrl-keyBody-keyEdit
      const keyArr = identity.split("-");
      const keys = {
        keyEdit: keyArr.pop(),
        keyBody: keyArr.pop(),
        keyUrl: keyArr.pop()
      };

      const keyState = keyArr.pop().split(".");
      if (keyState.length > 1) keyState[1] = +keyState[1];
      let data = this.state;
      keyState.forEach((key) => {
        data = data[key];
      });

      const isPassword = keys.keyEdit === 'password';

      return (
        <Field
          value={isPassword ? "" : data[keys.keyEdit] || ""}
          hideValue={hideValue}
          optional={optional}
          id={data.id}
          canEdit={keyState[0] === 'me' || this.state.me.admin}
          keys={keys}
          handleSubmit={(d) => { this.handleSubmit({key: keyState, data: d}); }}
          toggleEdit={() => { this.toggleEdit(identity); }}
          editing={this.state.editTarget === identity}
          title={title}
          description={description}
          helpText={helpText} />
      );
    };
    const fieldGroup = ({id, label, help, type, placeholder, props}) => {
      // console.log("fieldGroup logging id of: " + id + ", where value = " + value);
      return (
        <FormGroup controlId={id}>
          {label ? <ControlLabel>{label}</ControlLabel> : null}
          {
            type !== "textarea" ?
              <FormControl
                value={this.state.addAdminData[id]}
                {...props}
                placeholder={placeholder}
                type={type}
                onChange={(event) => { this.handleAddAdminFormChange(id, event.target.value); }} />
              :
              <FormControl
                componentClass={type}
                value={this.state.addAdminData[id]}
                onChange={(event) => { this.handleAddAdminFormChange(id, event.target.value); }} />
          }
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
      );
    };

    return this.state.userStoreLoading ? <div className="flex-row flex-vhCenter"><Loading type='bubbles' color='#337ab7' /></div> : (
      <section className="profile">
        <Dimmer active={this.state.loading} page children={<Loader />} />
        <Grid fluid>
          <Row>
            <Col xs={24} style={{padding: 10}}>
              <h2>Your Organisation</h2>
              <p className="helpText">Only admin can edit.</p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={4} className="flex-row flex-vhCenter" style={{padding: 10}}>
              <Image src={this.state.org.logo} responsive style={{maxHeight: 150}} />
            </Col>
            <Col xs={12} sm={8}>
              <ListGroup>
                <ListGroupItem>
                  Change logo:{" "}
                  <div className="inline-block">
                    <FileInput
                      handleChange={(file) => {
                        const err = checkError(file);
                        if (!!err) return window.alert(err);
                        // set loading
                        this.setState({loading: true})
                        // upload
                        const keyPrefix = (
                          "Companies/" +
                          (this.state.org.name || "default") +
                          "/logo" +
                          yyyymmddhhmmss(new Date())
                        );
                        const prevLogo = this.state.org.logo;
                        const key = keyPrefix + "." + file.type.split("/")[1]
                        this.s3.putObject({
                          Bucket: "assets.hjobs.hk",
                          Key: key,
                          ACL: "public-read-write",
                          Body: file,
                          ContentType: file.type,
                          ContentEncoding: "Base64"
                        }, (err, data) => {
                          console.log({err, data});
                          if (err) return alert("Something went wrong with your upload");
                          request("orgs/" + this.state.org.id, "PATCH", {org: {
                            logo: "https://assets.hjobs.hk/" + key
                          }}).then(res => res.json()).then(data => {
                            if (!!data && !data.errors) {
                              UserActions.setUser({org: data});
                              this.setState(s => { s.loading = false; return s; })
                              deletePhoto(prevLogo);
                            }
                          })
                        })
                      }}
                    />
                  </div>
                </ListGroupItem>
                {generateField({
                  identity: "org-orgs-org-name",
                  title: "Company Name",
                  optional: false
                })}
                {generateField({
                  identity: "org-orgs-org-email",
                  title: "Company Email",
                  description: "Potential candidates will contact you via this email.",
                  optional: false
                })}
                {generateField({
                  identity: "org-orgs-org-description",
                  title: "Company description",
                  optional: false
                })}
                <ListGroupItem className="flex-row">
                  <div style={{paddingRight: "1em"}}>
                    Locations:
                  </div>
                  <div style={{flexGrow: 1}}>
                    <Locations
                      locations={this.state.org.locations}
                      locationKeyToDisplay={"city"}
                      onChange={(data) => UserActions.editOrg({locations: data})}
                    />
                    <div>
                      <span className="help-text">Specify work location(s) here.</span>
                    </div>
                  </div>
                </ListGroupItem>
              </ListGroup>
              <hr />
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <h2>Your Profile</h2>
            </Col>
            <Col xs={12}>
              <ListGroup>
                <p>{this.state.me.admin ? null : 'Not '}Admin</p>
                {generateField({
                  identity: "me-employers-employer-name",
                  title: "Your name",
                  optional: false
                })}
                {generateField({
                  identity: "me-employers-employer-email",
                  title: "Your email",
                  description: "This will be your login username",
                  optional: false
                })}
                {generateField({
                  identity: "me-employers-employer-password",
                  title: "Change your password",
                  optional: false,
                  hideValue: true
                })}
              </ListGroup>
              <hr />
            </Col>
          </Row>

          {this.state.me.admin ?
            <Row>
              <Col xs={12}>
                <h2>Manage accounts</h2>
                <p className="helpText">Only admin can view / edit.<br />You can add, edit or delete accounts here.</p>
                <div className="flex-row flex-vhCenter"><Button bsStyle="link" bsSize="small" onClick={() => { this.toggleAddAdminModal(); }}>Add a team member</Button></div>
              </Col>
              <Col xs={12}>
                <ListGroup className="employers-list-group">
                  { this.state.employers.map((employer, index) => employer.id !== this.state.me.id ?
                    <ListGroupItem key={'employers-' + index}>
                      <div
                        className="cursor"
                        onClick={() => { this.deleteEmployer(employer); }}
                        style={{position: "absolute", top: 10, right: 20, fontSize: "16px"}}
                        ><i className="fa fa-times-circle" aria-hidden="true"></i></div>
                      <p>{employer.admin ? null : 'Not '}Admin</p>
                      <ListGroup>
                        {generateField({
                          identity: "employers." + index + "-employers-employer-name",
                          employerIndex: index,
                          title: "Name",
                          optional: false
                        })}
                        {generateField({
                          identity: "employers." + index + "-employers-employer-email",
                          employerIndex: index,
                          title: "Change Email",
                          optional: false
                        })}
                        {generateField({
                          identity: "employers." + index + "-employers-employer-password",
                          employerIndex: index,
                          title: "Change password",
                          optional: false,
                          hideValue: true
                        })}
                      </ListGroup>
                    </ListGroupItem> : null
                  )}
                </ListGroup>
                <hr />
              </Col>
            </Row>
          : null}
          
        </Grid>
        
        <Modal
          show={this.state.showModal}
          dialogClassName="add-employer-modal">
          <Modal.Body bsClass="modal-body">
            { fieldGroup({
              id: "name",
              type: "text",
              label: "Name of team member"
            })}
            { fieldGroup({
              id: "email",
              type: "username",
              label: "Enter a new email"
            })}
            { fieldGroup({
              id: "password",
              type: "password",
              label: "Enter a password",
              help: "All personnels can change their own password"
            })}
            <p>Admin: <input type="checkbox" value={this.state.addAdminData.admin} onClick={() => { this.toggleAddAdminCheckbox(); }} /></p>
            <div className="flex-row flex-vhCenter red-text">{this.state.modalErrorMsg}</div>
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="danger" onClick={() => { this.setState({showModal: false}); }}>Close</Button>
            <Button bsStyle="success" onClick={() => { this.submitAddEmployer(); }} >save</Button>
          </Modal.Footer>
        </Modal>

        <SuccessFade
          successShown={this.state.successShown}
        />
      </section>
    );
  }
}

export default Profile;
