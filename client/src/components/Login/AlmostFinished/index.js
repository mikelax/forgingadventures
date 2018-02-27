import _ from 'lodash';
import Bluebird from 'bluebird';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, Container, Form, Message } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import TimezoneSelect from '../../shared/components/TimezoneSelect';
import { meQuery, updateMeMutation, validUsernameQuery } from '../../../queries/users';
import { uploadImage } from '../../../services/image';
import { getMyDetails } from '../../../actions/me';

import './AlmostFinished.styl';


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

  componentWillReceiveProps(nextProps) {
    this.setState({
      store: {
        username: _.get(nextProps.data, 'me.username') || '',
        name: _.get(nextProps.data, 'me.name') || '',
        timezone: _.get(nextProps.data, 'me.timezone') || '',
        profileImageUrl: _.get(nextProps.data, 'me.profileImage.url') || ''
      }
    });
  }

  render() {
    const { profileImageUrl } = this.state.store;
    const { loading } = this.props.data;

    return (
      <React.Fragment>
        <Helmet>
          <title>Almost Finished - Complete your Profile</title>
        </Helmet>

        <div className="AlmostFinished">
          <Container>
            <h1>You're mere steps away from starting your Adventure</h1>
            <h2>But first, you must finish completing your Profile</h2>

            <Form loading={loading}>
              <Form.Field required>
                <label>Unique Username</label>
                <Form.Input
                  error={this._validity('username')}
                  placeholder="Enter Your Username"
                  value={this._formValue('username')}
                  onChange={this._formInput('username')}
                />
                <Message error visible={this._validity('username')} size="small">
                  Sorry, That Username is taken.
                </Message>
              </Form.Field>

              <Form.Field required>
                <label>Name</label>
                <Form.Input
                  required
                  error={this._validity('name')}
                  placeholder="Enter Your Name"
                  value={this._formValue('name')}
                  onChange={this._formInput('name')}
                />
              </Form.Field>

              <Form.Field>
                <label>Profile Image</label>
                {
                  profileImageUrl ? (
                    <div className="profile-image"><img src={profileImageUrl} alt=""/></div>
                  ) : null
                }
                <Form.Input
                  type="file"
                  placeholder="Select profile image"
                  onChange={this._handleImage}
                />
              </Form.Field>

              <Form.Field>
                <label>Location</label>
                <TimezoneSelect
                  name="timezone"
                  value={this._formValue('timezone')}
                  onChange={this._setTimezone}
                />
              </Form.Field>

              <div className="actions text-right">
                <Button primary disabled={this.state.saving} loading={this.state.saving} onClick={this._submit}>
                  {this.state.saving ? 'Submitting' : 'Submit'}
                </Button>
              </div>

            </Form>

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
      const { store } = this.state;

      store.profileImageUrl = reader.result;

      this.setState({ ...this.state, store });
      this.setState({ file });
    };

    reader.readAsDataURL(file);
  };

  _valid = () => {
    const errors = {};

    return Bluebird.try(() => {
      const { validUsername } = this.props;
      const username = this._formValue('username');

      errors.username = _.isEmpty(username);
      errors.name = _.isEmpty(this._formValue('name'));

      if (username) {
        return validUsername({
          variables: {
            username: this._formValue('username')
          }
        })
          .then((res) => {
            const { validUsername } = res.data;

            errors.username = !(validUsername);
          });
      }
    })
      .then(() => _(errors).values().sumBy(v => v) === 0)
      .tap(() => this.setState({ errors }));
  };

  _validity = (field) => {
    return this.state.errors[field] === true;
  };

  _formInput = (stateKey) => {
    return (e) => {
      const { store } = this.state;

      _.set(store, stateKey, e.target.value);
      this.setState({ ...this.state, store });
    };
  };

  _setTimezone = (timezone) => {
    const value = _.get(timezone, 'value', null);

    const { store } = this.state;
    _.set(store, 'timezone', value);
    this.setState({ ...this.state, store });
  };

  _formValue = (stateKey) => {
    return _.get(this.state.store, stateKey, '');
  };

  _submit = (e) => {
    return this._valid()
      .then((valid) => {
        if (valid) {
          const { store } = this.state;
          const { file } = this.state;
          const { getMyDetailsDispatch } = this.props;

          this.setState({ saving: true });

          return uploadImage(file, 'userProfile')
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

              const { updateMe } = this.props;

              return updateMe({
                variables: {
                  input: payload
                },
                refetchQueries: [{
                  query: meQuery
                }]
              })
                .then(() => this.setState({ saving: false }))
                .then(() => getMyDetailsDispatch())
                .then(() => this.props.history.replace('/games'));
            });
        }
      });
  };
}

const mapDispatchToProps = dispatch => ({
  getMyDetailsDispatch: () => dispatch(getMyDetails())
});


export default compose(
  graphql(meQuery),
  graphql(validUsernameQuery, {
    name: 'validUsername'
  }),
  graphql(updateMeMutation, {
    name: 'updateMe'
  }),
  connect(null, mapDispatchToProps, null, { pure: false }),
)(AlmostFinished);

