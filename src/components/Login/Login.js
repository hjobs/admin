import React from 'react';
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

import Variable from '../../services/var';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInUp: "up",
      signInLoading: false,
      signUpLoading: false,
      logoUnderstood: false,
      errorMsg: null,
      up: {
        name: "",
        description: "",
        logo: "",
        email: "",
        password: ""
      },
      in: {
        email: "",
        password: ""
      }
    };
    this.vars = new Variable();
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
    const headers = {"Content-Type": "application/json"};
    let
      url = this.vars.baseUrl,
      bodyData;

    if (this.state.signInUp === 'in') {
      bodyData = JSON.stringify(formData);
      url += 'authenticate';
    } else if (this.state.signInUp === 'up') {
      bodyData = JSON.stringify({org: formData});
      url += 'orgs';
    } else {
      window.alert("Sorry, there is an error, please contact admin if problem persists");
    }

    fetch(url, {
        method: 'POST',
        headers,
        body: bodyData
      })
        .then(res => {
          console.log(res);
          if (res.status > 300) {
            this.setState({errorMsg: res.statusText});
          } else {
            return res.json();
          }
        })
        .then(d => {
          console.log(d);
          if (d && d.auth_token) {
            localStorage.setItem("authToken", d.auth_token);
            this.props.signInUp({org: d.org, me: d.me, auth_token: d.auth_token});
          } else if (d && d.error) {
            localStorage.removeItem("authToken");
            this.setState({errorMsg: d.error.employer_authentication });
          }
        });
  }

  logoUnderstood() {
    this.setState({logoUnderstood: true});
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

    return (
      <div className="flex-col flex-vhCenter sign">
      { (this.state.signInUp === "in") ?
        (
        <section className="signin">
          <p className="text-right link" onClick={() => { this.toggleInUp(); }}>Sign Up here!</p>
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
          <p className="link text-right" onClick={() => { this.toggleInUp(); }}>Already have an account? Log In here!</p>
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
            {
              this.state.logoUnderstood ?
                fieldGroup({
                  id: "up-logo",
                  type: "text",
                  label: "Logo (Dropbox Link)",
                  help: "Please upload your company's logo, in a square, to your desired cloud service, and attach a download link here."
                })
                :
                <FormGroup>
                  <ControlLabel>Logo (Dropbox Link)</ControlLabel>
                  <HelpBlock>
                    Please upload your company's logo, in a square to dropbox, and attach a download link here.
                    <Button className="logo-button" bsSize="xs" bsStyle="primary" onClick={() => { this.logoUnderstood(); }}>I Understand</Button>
                  </HelpBlock>
                </FormGroup>
            }
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

Login.propTypes = {
  signInUp: React.PropTypes.func.isRequired
};

export default Login;
