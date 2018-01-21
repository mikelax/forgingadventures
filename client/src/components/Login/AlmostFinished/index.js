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
      username: '',
      name: ''
    },
    // the form validity state
    errors: {}
  }
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
              <FormGroup validationState={this.validity('username')}>
                <ControlLabel>Unique Username</ControlLabel>
                <FormControl
                  type="text"
                  value={this.formValue('username')}
                  placeholder="Enter Your Username"
                  onChange={this.formInput('username')}
                />
              </FormGroup>

              <FormGroup validationState={this.validity('name')}>
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  type="text"
                  value={this.formValue('name')}
                  placeholder="Enter Your Name"
                  onChange={this.formInput('name')}
                />
              </FormGroup>

              <FormGroup validationState={this.validity('timezone')}>
                <ControlLabel>Location</ControlLabel>
                <TimezonePicker
                  absolute={false}
                  placeholder="Select timezone..."
                />
              </FormGroup>
            </form>

            <div className="actions text-right">
              <Button bsStyle="primary" onClick={this.submit}>Submit</Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  valid = () => {
    const errors = {};

    _.isEmpty(this.formValue('username')) && (errors.username = 'Username is required');
    _.isEmpty(this.formValue('name')) && (errors.name = 'Name is required');


    this.setState({...this.state, errors});

    return _.keys(errors).length === 0;
  };

  validity = (field) => {
    if (this.state.errors[field]) {
      return 'error';
    }
  };

  formInput = (stateKey) => {
    return (e) => {
      const { store } = this.state;

      _.set(store, stateKey, e.target.value);
      this.setState({...this.state, store});
    };
  };

  formValue = (stateKey) => {
    return _.get(this.state.store, stateKey, '');
  };
}

const mapStateToProps = state => ({
  authorisation: state.authorisation,
});

export default connect(
  mapStateToProps
)(AlmostFinished);
