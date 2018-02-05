// @flow

import React, { Component } from 'react';
import { Container, Item } from 'semantic-ui-react';

import { getProfile } from '../../services/webAuth';

import './Profile.css';

export default class Profile extends Component {

  state = {
    profile: null
  };

  componentWillMount() {
    return getProfile()
      .then(profile => {
        this.setState({ profile });
      });
  }

  render() {
    const { profile } = this.state;

    if (profile) {
      return (
        <Container>
          <Item>
            <Item.Image src={profile.picture} />
            <Item.Content>
              <Item.Header as='h1'>{profile.name}</Item.Header>
              <Item.Meta>{profile.nickname}</Item.Meta>
              <Item.Description><pre>{JSON.stringify(profile, null, 2)}</pre></Item.Description>
            </Item.Content>

          </Item>
        </Container>
      );
    } else {
      return null;
    }
  }
}
