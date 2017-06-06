import React from 'react';
import Reflux from 'reflux';
import { withRouter } from 'react-router-dom';
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

import Http from '../../services/http';

import UserStore, { UserActions } from '../../stores/userStore';

class Login extends Reflux.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInUp: "up",
      signInLoading: false,
      signUpLoading: false,
      errorMsg: null,
      up: {
        name: "",
        description: "",
        email: "",
        password: ""
      },
      in: {
        email: "",
        password: ""
      }
    };
    this.store = UserStore;
  }

  submit() {
    event.preventDefault();
    const
      formData = this.state.signInUp === 'in' ? this.state.in : this.state.up,
      errorArr = [];
    for (const key in formData) {
      if ((key !== "logo" && key !== "description") && !formData[key]) {
        errorArr.push(key);
      }
    }
    if (errorArr.length > 0) {
      this.setState({errorMsg: "Please fill in " + errorArr.join(', ') + "."});
    } else {
      this.setState({loading: true}, () => {
        this.signInUp(formData);
      });
    }
  }

  signInUp(formData) {
    let urlSuffix;
    let bodyData;
    const onError = (reason) => {
      this.setState(s => {
        s.errorMsg = reason || "There is an error";
        return s;
      });
    }

    if (this.state.signInUp === 'in') {
      bodyData = (formData);
      urlSuffix = 'authenticate';
    } else if (this.state.signInUp === 'up') {
      bodyData = {org: formData};
      urlSuffix = 'orgs';
    } else {
      window.alert("Sorry, there is an error, please contact admin if problem persists");
    }

    Http.request(urlSuffix, "POST", bodyData).then(res => {
      console.log(res);
      if (!res.ok) return this.setState(s => { s.errorMsg = res.statusText; return s; });
      return res.json();
    })
    .then(d => {
      console.log(d);
      if (!d || d.error) {
        onError(!d ? "Unauthorised" : d.error.employer_authentication);
      } else if (!!d && d.auth_token) {
        UserActions.setUser(d, d.auth_token);
        window.setTimeout(() => this.props.history.push("/board"), 300);
      }
    }).catch(err => onError(err.toString()));
  }

  toggleInUp() {
    const data = {};
    data.signInUp = this.state.signInUp === "up" ? "in" : "up";
    data.errorMsg = null;
    this.setState(data);
  }

  handleFormChange(id, value) {
    // console.log('logging ' + id + ' event, and event = ');
    // console.log(value);
    const idArr = id.split("-");
    const data = this.state[idArr[0]];
    data[idArr[1]] = value;
    
    this.setState(data, () => {
      // console.log("logging this.state"); console.log(this.state);
    });
  }

  render() {
    const fieldGroup = ({id, label, help, type, placeholder, props}) => {
      const idArr = id.split("-");
      let value = this.state[idArr[0]][idArr[1]];
      // console.log("fieldGroup logging id of: " + id + ", where value = " + value);
      return (
        <FormGroup controlId={id}>
          {label ? <ControlLabel>{label}</ControlLabel> : null}
          {
            type !== "textarea" ?
              <FormControl
                value={value}
                style={{fontSize: 16}}
                {...props}
                placeholder={placeholder}
                type={type}
                onChange={(event) => { this.handleFormChange(id, event.target.value); }} />
              :
              <FormControl
                componentClass={type}
                style={{fontSize: 16}}
                value={value}
                onChange={(event) => { this.handleFormChange(id, event.target.value); }} />
          }
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
      );
    };

    return (
      <div className="flex-col flex-vhCenter sign">
      { (this.state.signInUp === "in") ?
        (
        <section className="signin">
          <p className="text-right link" onClick={() => { this.toggleInUp(); }} style={{paddingBottom: "30px"}}>Sign Up here!</p>
          <h2 className="text-center">Login</h2>
          <form onSubmit={(e) => { e.preventDefault(); this.submit(); }}>
            { fieldGroup({
              id: "in-email",
              type: "username",
              placeholder: "email"
            })}
            { fieldGroup({
              id: "in-password",
              type: "password",
              placeholder: "password"
            })}
            <p className="error">{this.state.errorMsg}</p>
            <div className="flex-row flex-vhCenter">
              <Button type="submit" bsStyle="primary">Submit</Button>
            </div>
          </form>
        </section>
        )
        :
        (
        <section className="signup">
          <p className="link text-right" onClick={() => { this.toggleInUp(); }} style={{paddingBottom: "30px"}}>Already have an account? Log In here!</p>
          <h2 className="text-center">SignUp</h2>
          <form onSubmit={(e) => { e.preventDefault(); this.submit(); }}>
            { fieldGroup({
              id: "up-name",
              type: "text",
              label: "Organisation name"
            })}
            { /* fieldGroup({
              id: "up-description",
              type: "textarea",
              label: "Description (optional)",
              help: "Let people know what your organisation is about in a short description"
            }) */}
            { fieldGroup({
              id: "up-email",
              type: "username",
              label: "Enter your email"
            })}
            { fieldGroup({
              id: "up-password",
              type: "password",
              label: "Enter a password"
            })}
            <p className="error">{this.state.errorMsg}</p>
            <div className="flex-row flex-vhCenter">
              <Button type="submit" bsStyle="primary">Submit</Button>
            </div>
          </form>
        </section>
        )
      }
      </div>
    );
  }
}

export default withRouter(Login);
