import React from 'react';
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInUp: "up",
      signInLoading: false,
      signUpLoading: false,
      logoUnderstood: false,
      errorMsg: null
    };
  }

  submit() {
    event.preventDefault();

    if (this.state.signInUp === 'in') {
      let data = {};
      data.email = document.getElementById("in-email").value;
      data.password = document.getElementById("in-password").value;

      const url = this.props.baseUrl + 'authenticate';
      fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
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
          if (d.auth_token) {
            localStorage.setItem("authToken", d.auth_token);
            this.props.login(d.org, d.employer, d.auth_token);
          } else {
            localStorage.removeItem("authToken");
            this.setState({errorMsg: d.error.employer_authentication });
          }
        });
    } else if (this.state.signInUp === 'up') {
      const data = {};
      data.name = document.getElementById("up-name").value;
      data.description = document.getElementById("up-desc").value;
      data.logo = document.getElementById("up-logo").value;
      data.email = document.getElementById("up-email").value;
      data.password = document.getElementById("up-password").value;

      const url = this.props.baseUrl + 'orgs';
      fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({org: data})
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
          if (d.auth_token) {
            localStorage.setItem("authToken", d.auth_token);
            this.props.login(d.org, d.employer, d.auth_token);
          } else {
            localStorage.removeItem("authToken");
            this.setState({errorMsg: d.error.employer_authentication });
          }
        });
    } else {
      window.alert("Sorry, there is an error, please contact admin if problem persists");
    }
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

    return (
      <div className="sign">
      { (this.state.signInUp === "in") ?
        (
        <section className="signin">
          <p className="toggle-link text-right" onClick={() => { this.toggleInUp(); }}>Sign Up here!</p>
          <h2 className="text-center">Login</h2>
          <form onSubmit={() => { this.submit(); }}>
            <FieldGroup
              id="in-email"
              type="username"
              placeholder="email"
            />
            <FieldGroup
              id="in-password"
              type="password"
              placeholder="password"
            />
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
          <p className="toggle-link text-right" onClick={() => { this.toggleInUp(); }}>Already have an account? Log In here!</p>
          <h2 className="text-center">SignUp</h2>
          <form onSubmit={() => { this.submit(); }}>
            <FieldGroup
              id="up-name"
              label="Organisation name"
              type="text"
            />
            <FieldGroup
              id="up-desc"
              label="Description (optional)"
              help="Let people know what your organisation is about in a short description"
              type="text"
            />
            {
              this.state.logoUnderstood ?
                <FieldGroup
                  id="up-logo"
                  label="Logo (Dropbox Link)"
                  help="Please upload your company's logo, in a square, to your desired cloud service, and attach a download link here."
                  type="text" />
                :
                <FormGroup>
                  <ControlLabel>Logo (Dropbox Link)</ControlLabel>
                  <HelpBlock>
                    Please upload your company's logo, in a square to dropbox, and attach a download link here.
                    <Button className="logo-button" bsSize="xs" bsStyle="info" onClick={() => { this.logoUnderstood(); }}>I Understand</Button>
                  </HelpBlock>
                </FormGroup>
            }
            <FieldGroup
              id="up-email"
              label="Enter your email"
              type="username"
            />
            <FieldGroup
              id="up-password"
              label="Enter a password"
              type="password"
            />
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
  baseUrl: React.PropTypes.string,
  login: React.PropTypes.func
};

export default Login;
