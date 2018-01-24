import _ from 'lodash';
import React, { Component } from 'react';
import { Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import { Helmet } from "react-helmet";
import { connect } from 'react-redux';

import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';
import './AlmostFinished.styl';

class AlmostFinished extends Component {
  state = {
    // the form control state
    store: {
      username: _.get(this.props, 'me.me.userMetadata.username') || '',
      name: _.get(this.props, 'me.me.name'),
      timezone: ''
    },
    // the form validity state
    errors: {}
  };

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Almost Finished - Complete your Profile</title>
        </Helmet>

        <div className="AlmostFinished">
          <div className="container">
            <h1>You're mere steps away from starting your Adventure</h1>
            <h2>But first, you must finish completing your Profile</h2>

            <form>
              <FormGroup validationState={this._validity('username')}>
                <ControlLabel>Unique Username</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Enter Your Username"
                  value={this._formValue('username')}
                  onChange={this._formInput('username')}
                />
              </FormGroup>

              <FormGroup validationState={this._validity('name')}>
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Enter Your Name"
                  value={this._formValue('name')}
                  onChange={this._formInput('name')}
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Location</ControlLabel>
                <TimezonePicker
                  absolute={false}
                  placeholder="Select timezone..."
                  value={this._formValue('timezone')}
                  overflow="false"
                  onChange={this._setTimezone}
                />
              </FormGroup>

            </form>

            <div className="actions text-right">
              <Button bsStyle="primary" onClick={this._submit}>Submit</Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  _valid = () => {
    const errors = {};

    _.isEmpty(this._formValue('username')) && (errors.username = 'Username is required');
    _.isEmpty(this._formValue('name')) && (errors.name = 'Name is required');


    this.setState({...this.state, errors});

    return _.keys(errors).length === 0;
  };

  _validity = (field) => {
    if (this.state.errors[field]) {
      return 'error';
    }
  };

  _formInput = (stateKey) => {
    return (e) => {
      const { store } = this.state;

      _.set(store, stateKey, e.target.value);
      this.setState({...this.state, store});
    };
  };

  _setTimezone = (timezone) => {
    const { store } = this.state;
    _.set(store, 'timezone', timezone);
    this.setState({...this.state, store});
  };

  _formValue = (stateKey) => {
    return _.get(this.state.store, stateKey, '');
  };

  _submit = (e) => {

  };
}

const mapStateToProps = state => ({
  me: state.me,
});

export default connect(
  mapStateToProps
)(AlmostFinished);
