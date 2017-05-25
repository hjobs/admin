import React from 'react';
// import Reflux from 'reflux';
import { Button, ListGroupItem } from 'react-bootstrap';
// let Loading = require('react-loading');

import { request } from '../../services/http';

class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editValue: props.value,
      errorMsg: null,
      loading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.editing !== this.props.editing) { // after submit (though also includes other scenarios)
      this.setState({errorMsg: null, loading: false, editValue: nextProps.value});
    }
  }

  handleChange(value) {
    this.setState({editValue: value});
  }

  handleSubmit() {
    const isEmpty = (!this.props.optional && !this.state.editValue);
    const isSame = (this.props.value === this.state.editValue);
    if (isEmpty || isSame) {
      const errorArr = [];
      if (isEmpty) errorArr.push("do not leave empty");
      if (isSame) errorArr.push('change something');
      this.setState({errorMsg: "Please " + errorArr.join(" & ") + '.', loading: false});
      return;
    }

    this.setState({errorMsg: null, loading: true}, () => {
      const body = {};
      body[this.props.keys.keyBody] = {};
      body[this.props.keys.keyBody][this.props.keys.keyEdit] = this.state.editValue;

      request(this.props.keys.keyUrl + '/' + this.props.id, "PATCH", body).then(res => {
          // console.log(res);
          if (res.status < 202) return res.json();
          this.setState({errorMsg: res.statusText});
          return null;
        })
        .then(d => {
          if (d !== null) {
            console.log(d);
            this.setState({errorMsg: null}, () => { this.props.handleSubmit(d); });
          }
        });
    });
  }

  captureEnter(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleSubmit();
    }
  }

  render() {
    return (
      <ListGroupItem className="editable">
        <div>
          {this.props.title}
          {this.props.hideValue ? null : <span>: {this.props.value}</span>}
          {'  '}
          {!this.props.editing && this.props.canEdit ? <i className="fa fa-pencil" aria-hidden="true" onClick={() => { this.props.toggleEdit(); }}></i> : null }
          {this.props.description ? <span className="help-text"><br />{this.props.description}</span> : null }
        </div>

        {this.props.editing ?
          <div>
            <textarea
              autoFocus
              rows={3}
              disabled={this.state.loading}
              value={this.state.editValue}
              onChange={(event) => { this.handleChange(event.target.value); }}
              onKeyDown={(e) => { this.captureEnter(e); }}
            />
            {this.props.helpText ? <span className="help-text"><br />{this.props.helpText}</span> : null}
            <br />
            <div className="flex-row flex-spacedBetween button-group">
              <Button disabled={this.state.loading} bsSize="xsmall" bsStyle="success" onClick={() => { this.handleSubmit(); }}>Submit</Button>
              <Button disabled={this.state.loading} bsSize="xsmall" bsStyle="danger" onClick={() => { this.props.toggleEdit(); }}>Cancel</Button>
            </div>
            {this.state.errorMsg ?
              <div className="red-text">{this.state.errorMsg}</div> : null
            }
          </div>
        : null}

      </ListGroupItem>
    );
  }
}

Field.propTypes = {
  title: React.PropTypes.string,
  hideValue: React.PropTypes.bool,
  editing: React.PropTypes.bool,
  description: React.PropTypes.string,
  optional: React.PropTypes.bool,
  canEdit: React.PropTypes.bool,
  keys: React.PropTypes.any,
  id: React.PropTypes.number,
  value: React.PropTypes.string,
  helpText: React.PropTypes.string,
  toggleEdit: React.PropTypes.func,
  handleSubmit: React.PropTypes.func
};

export default Field;
