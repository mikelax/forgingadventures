import _ from 'lodash';
import Bluebird from 'bluebird';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Button, Container, Form, Grid,
  Header, Icon, Image, Label, Menu, Message } from 'semantic-ui-react';

import SuccessToast from '../shared/components/SuccessToast';
import TimezoneSelect from '../shared/components/TimezoneSelect';
import { meQuery, updateMeMutation, validUsernameQuery } from '../../queries/users';
import { uploadImage } from '../../services/image';
import { getProfile } from '../../services/webAuth';
import { getMyDetails } from '../../actions/me';

class Settings extends Component {
  constructor() {
    super();

    getProfile()
      .then(profile => {
        this.setState({ profile });
      });
  }

  state = {
    activeItem: 'profile',
    displaySuccess: false,
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

  static getDerivedStateFromProps(props) {
    return {
      store: {
        username: _.get(props.data, 'me.username') || '',
        name: _.get(props.data, 'me.name') || '',
        timezone: _.get(props.data, 'me.timezone') || '',
        profileImageUrl: _.get(props.data, 'me.profileImage.url') || ''
      }
    };
  }

  render() {
    const { activeItem, displaySuccess, store: { profileImageUrl } } = this.state;
    const email = _.get(this.state, 'profile.email');
    const emailVerified = _.get(this.state, 'profile.email_verified');
    const { loading } = _.get(this.props, 'data');

    return (
      <React.Fragment>
        <Helmet>
          <title>Update Settings</title>
        </Helmet>

        <div className="Settings">
          <Container>
            {
              displaySuccess ? (
                <SuccessToast text='Your changes have been saved, now back to the adventure!' />
              ) : null
            }

            <Grid>
              <Grid.Column width={3}>
                <Menu fluid vertical tabular>
                  <Menu.Item name='profile' active={activeItem === 'profile'} />
                </Menu>
              </Grid.Column>

              <Grid.Column stretched width={13}>
                <Header
                  as='h1'
                  content='Update User Settings'
                />

                <Form loading={loading}>
                  <Form.Field>
                    <label>Profile Image</label>
                    {
                      profileImageUrl ? (
                        <Image src={profileImageUrl} alt="Profile Image" />
                      ) : null
                    }
                    <Form.Input
                      type="file"
                      placeholder="Select profile image"
                      onChange={this._handleImage}
                    />
                  </Form.Field>

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

                  <Form.Group inline>
                    <Form.Input
                      label='Email'
                      value={email}
                      readOnly
                      width={6}
                    />
                    {emailVerified ?
                      (<Label pointing='left'>Verified <Icon color='green' size='big' name='check circle' /></Label>) :
                      <Button>Resend Verification Email</Button>
                    }
                  </Form.Group>

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
              </Grid.Column>
            </Grid>
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
      this.setState(prevState => {
        const { store } = prevState;
        store.profileImageUrl = reader.result;

        return { store };
      });
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
      this.setState(prevState => {
        const { store } = prevState;
        _.set(store, stateKey, e.target.value);

        return { store };
      });
    };
  };

  _setTimezone = (timezone) => {
    const value = _.get(timezone, 'value', null);

    this.setState(prevState => {
      const { store } = prevState;
      _.set(store, 'timezone', value);

      return { store };
    });
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

          this.setState({ saving: true, displaySuccess: false });

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
                .then(() => this.setState({ displaySuccess: true }));
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
)(Settings);
