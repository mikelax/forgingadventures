// @flow

import React, { Component } from 'react';
import { Panel, ControlLabel, Glyphicon } from 'react-bootstrap';
import { Container } from 'semantic-ui-react';

import {getProfile} from '../../services/webAuth';

import './Profile.css';

export default class Profile extends Component {

  state = {
    profile: null
  };

  componentWillMount() {
    return getProfile()
      .then(profile => {
        this.setState({profile});
      });
  }

  render() {
    const { profile } = this.state;

    if (profile) {
      return (
        <Container>
          <div className="profile-area">
            <h1>{profile.name}</h1>
            <Panel header="Profile">
              <img src={profile.picture} alt="profile" />
              <div>
                <ControlLabel><Glyphicon glyph="user" /> Nickname</ControlLabel>
                <h3>{profile.nickname}</h3>
              </div>
              <pre>{JSON.stringify(profile, null, 2)}</pre>
            </Panel>
          </div>
        </Container>
      );
    } else {
      return null;
    }
  }
}
