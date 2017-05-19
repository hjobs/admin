import React from 'react';
import Reflux from 'reflux';
import { Button, ListGroupItem } from 'react-bootstrap';
import Themes from '../../../styles/theme';

import UserStore, { UserActions } from '../../../stores/userStore';

import { request, getGoogleLocationData, getLocationObject } from '../../../services/http';

const newKey = "locations-new";

const Address = ({l, del}) => (
  <div>
    {l.city || l.address}
    {' '}<i className="fa fa-times" aria-hidden="true" style={{color: Themes.colors.red}} onClick={() => del()} />
  </div>
);

const EditAddress = ({onChange, cancel, submit, state}) => (
  <div>
    <div>
      <input
        onChange={(event) => onChange(event.target.value)}
        value={state.editValue}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="e.g. 14 Nathan Road"
      />
    </div>
    <div className="flex-row flex-vhCenter">
      <Button disabled={state.loading} bsSize="xsmall" bsStyle="success" onClick={() => submit()}>Submit</Button>
      <Button disabled={state.loading} bsSize="xsmall" bsStyle="danger" onClick={() => cancel()}>Cancel</Button>
    </div>
  </div>
)

class EditLocation extends Reflux.Component {
  constructor(props) {
    super(props);
    this.state = this.getEmptyState();
    this.store = UserStore;
    this.storeKeys = ["org"];
  }

  getEmptyState() {
    return {
      editValue: null,
      originalValue: null,
      errorMsg: null,
      loading: false
    };
  }

  handleChange(value) { this.setState({editValue: value}); }

  onHttpError(reason) {
    this.setState(s => {
      s.loading = false;
      s.errorMsg = reason;
      return s;
    });
  }

  handleSubmit() {
    const isEmpty = (!this.state.editValue);
    const isSame = (this.state.originalValue === this.state.editValue);
    if (isEmpty || isSame) {
      const errorArr = [];
      if (isEmpty) errorArr.push("do not leave empty");
      if (isSame) errorArr.push('change something');
      this.setState({errorMsg: "Please " + errorArr.join(" & ") + '.', loading: false});
      return;
    }

    const submit = (httpObj) => {
      request('orgs/' + this.state.org.id, "PATCH", httpObj).then(res => res.json()).then(d => {
        console.log(d);
        if (!d || !!d.errors) throw Error(!!d.errors ? d.errors.toString() : "Unprocessable data");
        this.setState(
          this.getEmptyState(),
          () => {
            UserActions.setUser({org: d});
            this.props.finishSubmit(d)
          }
        );
      }).catch(reason => this.onHttpError(reason.toString()))
    }

    this.setState({errorMsg: null, loading: true}, () => {
      getGoogleLocationData(this.state.editValue).then(res => res.json()).then(data => {
        // console.log(data)
        if (!data || data.status !== "OK") return this.onHttpError("We are not able to process your location data");
        const httpObject = {org: {locations: [getLocationObject(data, this.state.editValue)]}};
        submit(httpObject);
      }).catch(err => this.onHttpError(err.toString()))
    });
  }

  /** @param {number} id */
  delete(id) {
    this.setState(s => {
      s.loading = true;
      s.errorMsg = null;
      return s;
    },() => {
      request("orgs/" + this.state.org.id, "PATCH", {org: {
        locations: [{
          id,
          _destroy: true
        }]
      }}).then(res => res.json()).then(d => {
        if (!!d && !d.errors) {
          this.setState(
            this.getEmptyState(),
            () => {
              UserActions.setUser({org: d});
              this.props.finishSubmit(d);
            }
          )
        }
        else throw Error(!!d && d.errors ? d.derrors.toString() : "Unprocessable")
      }).catch(reason => {
        this.setState(s => {
          s.errorMsg = reason.toString() || "Unprocessable";
          s.loading = false;
          return s;
        });
      })
    })
  }

  toggleEdit(l = null) {
    this.setState(s => {
      s.editValue = !!l ? l.address : "";
      s.initialValue = !!l ? l.address : "";
      return s;
    },() => {
      this.props.toggleEdit(newKey);
    });
  }

  render() {
    const { editTarget } = this.props,
          hasLocation = !!this.state.org.locations && this.state.org.locations.length > 0,
          editingLocation = this.props.editTarget === newKey;
    return (
      <ListGroupItem className="editable">
        <div className="flex-row flex-vhStart">
          <div style={{paddingRight: "1em"}}>
            Locations:
          </div>
          <div style={{flexGrow: 1}}>
            {
              editingLocation ?
              <EditAddress
                state={this.state}
                onChange={(val) => this.handleChange(val)}
                cancel={() => this.props.toggleEdit()}
                submit={() => this.handleSubmit(this.state.initialValue)}
              />
              :
              (
                hasLocation ?
                this.state.org.locations.map(item =>(
                  <Address
                    key={"address-" + item.id}
                    l={item}
                    del={() => this.delete(item.id)}
                  />
                ))
                :
                <span>
                  Did not provide{" "}
                </span>
              )
            }
          </div>
        </div>
        <div className="text-red text-center">
          {this.state.errorMsg}
        </div>
        {
          !!this.props.editTarget && !this.state.errorMsg ? null :
          <div className="text-center" style={{fontSize: Themes.fontSizes.l}}>
            <i className="fa fa-plus-circle" aria-hidden="true" onClick={() => this.toggleEdit()} />
          </div>
        }
        <div>
          <span className="help-text">Specify work location(s) here.</span>
        </div>

      </ListGroupItem>
    );
  }
}

export default EditLocation;
