import _ from 'lodash';
import axios from 'axios';
import Bluebird from 'bluebird';
import React, { Component } from 'react';
import {graphql} from 'react-apollo';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import { Container } from 'semantic-ui-react';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import { Helmet } from "react-helmet";

import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';
import './AlmostFinished.styl';
import {compose} from "recompose";
import ApolloLoader from "../../shared/components/ApolloLoader";
import {updateMeMutation, meQuery, validUsernameQuery} from '../../../queries/users';
import {getAccessToken} from '../../../services/login';

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
          <Container>
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
              <Button bsStyle="primary" disabled={this.state.saving} onClick={this._submit}>
                { this.state.saving ? 'Submitting' : 'Submit' }
              </Button>
            </div>
          </Container>
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
          const {store} = this.state;

          this.setState({saving: true});

          return this._uploadImage()
            .then((imageDetails) => {
              const payload = {
                name: store.name,
                username: store.username,
                timezone: store.timezone
              };

              if (imageDetails) {
                payload.profileImage = {
                  publicId: _.get(imageDetails, 'publicId'),
                  userUploadId: _.get(imageDetails, 'userUploadId'),
                  url: _.get(imageDetails, 'imageUrl') || this.store.profileImageUrl
                };
              }

              const {updateMe} = this.props;

              return updateMe({
                variables: {
                  input: payload
                }
              })
                .then(() => this.setState({saving: false}))
                .then(() => this.props.history.replace('/games'));
            });
        }
      });
  };

  _uploadImage = () => {
    return Bluebird.try(() => {
      const data = new FormData();
      const {file} = this.state;

      if (file) {
        data.append('picture', this.state.file);

        // fixme - might need to add baseUrl to configs depending on API url when deploying
        // todo - setup an axios interceptor to automatically inject the Authorisation header
        return axios.post('/api/users/profile-image', data, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        })
          .then(res => res.data);
      }
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

