import React from 'react';
import Reflux from 'reflux';
// import { withRouter } from 'react-router-dom';
import { Button, Dimmer, Loader } from 'semantic-ui-react';
// import './Profile.css';

import UserStore, { UserActions } from '../../stores/userStore';
import TranslationStore from '../../stores/translationStore';

import Http from '../../services/http';

// import { userIconTextObjects } from '../../stores/data/profile';

class EditLocation extends Reflux.Component {
  constructor(props) {
    super(props);
    this.state = {
      choice: 0, // 0 = nothing chosen, 1 = use current location, 2 = enterStreetname
    };
    this.stores = [UserStore, TranslationStore];
  }
  useCurrentLocationButton() {
    return (
      <Button 
        loading={this.state.profile.loading}
        onClick={() => {
          this.setState(s => { s.loading = true; s.choice = 1; return s; }, () => {
            this.useCurrentLocation();
          });
        }}
        content={this.state.tStrings.profile.useCurrentLocation}
      />
    );
  }
  enterStreetNameButton() {
    return (
      <Button
        type="submit"
        onClick={() => {
          this.setState(s => {s.choice = 2; return s;})
        }}
        content={this.state.tStrings.profile.enterStreetName}
      />
    );
  }

  useCurrentLocation() {
    const onError = (error) => {
      console.log(["got error, in onError, logging error", error]);
      this.setState(s => {
        s.loading = false;
        s.choice = 0;
        s.errorMsg = error || this.state.tStrings.tryStreetAddress;
        return s;
      });
    }

    const geoSuccess = (data) => {
      console.log(data);
      const url = "https://maps.googleapis.com/maps/api/geocode/" +
                  "json?latlng=" +
                  data.coords.latitude + "," +
                  data.coords.longitude +
                  "&key=AIzaSyDqDJTU7suCklbnStTcieulgVHci8myzcQ";
      Http.request(url).then(res => res.json()).then(data => {
        console.log(["got google map data", data]);
        if (!data || !!data.error || data.status !== "OK") return onError(this.state.tStrings.profile.tryStreetAddress);
      }).catch(() => onError)
    };

    const geoError = (reason) => {
      console.log(["logging geoError reason", reason]);
      onError(reason);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      });
    } else {
      alert(this.state.tStrings.profile.geoNotSupported);
      this.setState(s => {
        s.choice = 0;
        s.loading = false;
        return s;
      });
    }
  }
  
  /** @param {string} error */
  onError(error) {
    this.setState(s => {
      s.errorMsg = error || this.state.tStrings.profile.cannotProcessStreetName
      s.loading = false;
      return s;
    });
  }

  render() {
    const profile = this.state.profile;
    // switch (this.state.choice) {
    //   case 1:
    //     return (
    //       <div className="edit-location-container full-width">
    //         {this.useCurrentLocationButton()}
    //       </div>
    //     );
    //   case 2:
    //     return (
    //       <div className="edit-location-container full-width">
            
    //       </div>
    //     );
    //   default:
    //     return (
    //       <div className="edit-location-container full-width">
    //         {this.useCurrentLocationButton()}
    //         {this.enterStreetNameButton()}
    //         {
    //           !this.state.errorMsg ? null :
    //           <p className="text-red">{this.state.errorMsg}</p>
    //         }
    //       </div>
    //     );
    // }
    return (
      <div className="edit-location-container full-width">
        <input
          className="full-width"
          autoFocus
          disabled={profile.loading}
          value={profile.editing.data}
          placeholder={this.state.tStrings.profile.locationPlaceholder}
          onChange={(event) => {
            const str = event.target.value;
            UserActions.editProfileItem(str);
          }}
        />
        {
          !profile.errorMsg ? null :
            <p className="text-red">
              {profile.errorMsg}
            </p>
        }
        <Dimmer active={profile.loading}>
          <Loader />
        </Dimmer>
      </div>
    )
  }
}

export default EditLocation;
