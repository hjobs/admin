import React from 'react';
import Reflux from 'reflux';
import Themes from '../../styles/theme';
import clone from 'clone';

// import EditStore, { EditActions } from '../../stores/editStore';

import { mergeStyles } from '../../services/var';
import { getGoogleLocationData, getLocationObject } from '../../services/http';

class Locations extends Reflux.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      errorMsg: "",
      loading: false
    }
  }

  listenKeyDown(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.addNew();
    }
  }

  setLoading(val = true) {
    this.setState(s => {
      s.loading = val;
      return s;
    });
    if (this.props.setLoading) this.props.setLoading(val);
  }

  addNew() {
    const streetName = this.state.inputValue
    if (!streetName) return;
    this.setLoading();
    const locations = clone(this.props.locations);
    getGoogleLocationData(streetName).then(res => res.json()).then(d => {
      if (!d || d.status !== "OK") throw Error("Unprocessable location data");
      const locationObj = getLocationObject(d, streetName);
      locations.push(locationObj);
      this.setState(s => {
        s.inputValue = "";
        s.errorMsg = null
        return s;
      }, () => this.props.onChange(locations))
    }).catch(err => {
      this.setState(s => {
        s.errorMsg = !!err ? err.toString() : "Unprocessable location data";
        return s;
      }, () => this.setLoading(false))
    })
  }
 
  remove(index) {
    const locations = clone(this.props.locations) || [];
    if (!locations[index].id) {
      locations.splice(index, 1);
      this.props.onChange(locations);
    } else {
      locations[index]._destroy = true;
      this.props.onChange(locations);
    }
  }

  render() {
    const { locations, placeholder, loading, locationKeyToDisplay, style } = this.props,
          noLocations = !locations || locations.length <= 0,
          containerStyle = mergeStyles({fontSize: this.props.fontSize || Themes.fontSizes.s}, style);
    return (
      <div style={containerStyle}>
        {
          noLocations ?
          <span
            style={{color: Themes.colors.gray}}
            children={placeholder}
          />
          :
          <ul className="full-width" style={{paddingLeft: "1.5em"}}>
            {locations.map((l, i) => !!l._destroy ? null : (
              <li key={'locations-' + i}>
                {l[locationKeyToDisplay || "address"] || l.address || l.street}{" "}
                <i className="fa fa-times link" aria-hidden="true" style={{color: Themes.colors.red}} onClick={() => this.remove(i)} />
              </li>
            ))}
          </ul>
        }
        {
          !this.state.errorMsg ? null :
          <div className="text-red">{this.state.errorMsg}</div>
        }
        <div>
          <input
            disabled={loading || this.state.loading}
            value={this.state.inputValue}
            placeholder="+ Add Location"
            onKeyDown={event => this.listenKeyDown(event)}
            onBlur={event => this.addNew()}
            onChange={event => {
              const val = event.target.value;
              this.setState(s => {
                s.inputValue = val;
                return s;
              })
            }}
            style={{
              border: 0,
              fontSize: Themes.fontSizes.m
            }}
          />
        </div>
      </div>
    );
  }
}

/*
setLoading: function to set to loading
loading: value to indicate the parent is loading
placeholder: display when no locations are available?
locations: the locations to display
locationKeyToDisplay: the key of location to display in list
onChange: spits out the new location
*/

export default Locations;
