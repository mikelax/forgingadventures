import _ from 'lodash';
import axios from 'axios';
import Bluebird from 'bluebird';
import React, { Component } from 'react';
import {graphql} from 'react-apollo';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import { Helmet } from "react-helmet";

import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';
import './AlmostFinished.styl';
import {compose} from "recompose";
import ApolloLoader from "../../shared/components/ApolloLoader";
import {updateMeMutation, meQuery, validUsernameQuery} from "../../../queries/users";

class AlmostFinished extends Component {
  state = {
    // the form control state
    store: {
      username: '',
      name: '',
      timezone: '',
      profileImageUrl: ''
    },
    // the form validity state
    errors: {}
  };

  componentWillMount() {
    this.setState({
      store: {
        username: _.get(this.props.data, 'me.username') || '',
        name: _.get(this.props.data, 'me.name') || '',
        timezone: _.get(this.props.data, 'me.timezone') || '',
        profileImageUrl: _.get(this.props.data, 'me.profileImage.url') || ''
      }
    });
  }

  render() {
    const {profileImageUrl} = this.state.store;

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
                <HelpBlock>{_.get(this.state, 'errors.username')}</HelpBlock>
              </FormGroup>

              <FormGroup validationState={this._validity('name')}>
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Enter Your Name"
                  value={this._formValue('name')}
                  onChange={this._formInput('name')}
                />
                <HelpBlock>{_.get(this.state, 'errors.name')}</HelpBlock>
              </FormGroup>

              <FormGroup>
                <ControlLabel>Profile Image</ControlLabel>
                {
                  profileImageUrl ? (
                    <div className="profile-image"><img src={profileImageUrl} alt=""/></div>
                  ) : null
                }
                <FormControl
                  type="file"
                  placeholder="Select profile image"
                  onChange={this._handleImage}
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

  _handleImage = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      const {store} = this.state;

      store.profileImageUrl = reader.result;

      this.setState({...this.state, store});
      this.setState({file});
    };

    reader.readAsDataURL(file);
  };

  _valid = () => {
    const errors = {};

    return Bluebird.try(() => {
      const {validUsername} = this.props;
      const username = this._formValue('username');

      _.isEmpty(username) && (errors.username = 'Username is required');
      _.isEmpty(this._formValue('name')) && (errors.name = 'Name is required');

      if (username) {
        return validUsername({
          variables: {
            username: this._formValue('username')
          }
        })
          .then((res) => {
            const {validUsername} = res.data;

            if (!(validUsername)) {
              errors.username = 'Username is taken';
            }
          });
      }
    })
      .then(() => _.keys(errors).length === 0)
      .tap(() => this.setState({...this.state, errors}));
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
    return this._valid()
      .then((valid) => {
        if (valid) {
          //upload image
        }
      });
  };

  _uploadImage = () => {
    return axios.post('',
      {
        params: {
          fields
        },
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        responseType: 'json'
      });

  }
}

export default compose(
  graphql(meQuery),
  graphql(validUsernameQuery, {
    name: 'validUsername'
  }),
  graphql(updateMeMutation, {
    name: 'updateMe'
  }),
  ApolloLoader,
)(AlmostFinished);

