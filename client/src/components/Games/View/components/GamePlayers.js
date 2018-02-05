import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose, pure } from "recompose";
import { Button, Image, List, Popup, Icon } from 'semantic-ui-react';

import { gamePlayersQuery } from '../../queries';
import ApolloLoader from '../../../shared/components/ApolloLoader';

import './assets/GamePlayers.styl';

class GamePlayers extends Component {
  render() {
    const { data: { gamePlayers } } = this.props;

    return (
      <div className="GamePlayers">
        <List divided verticalAlign='middle'>
          {_.map(gamePlayers, (player) => (
            <List.Item key={player.id}>
              <List.Content floated='right'>
                {this._gmActions(player.status)}
              </List.Content>
              <Image avatar src={_.get(player, 'user.profileImage.url')} />
              <List.Content>
                <List.Header as='a'>{player.user.name}</List.Header>
                <List.Description>
                  {_.startCase(player.status)}
                </List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </div>
    );
  }

  ////// private

  _gmActions = (status) => {
    if (status === 'pending') {
      return (
        <Popup
          trigger={<Button icon><Icon name="setting" /></Button>}
          flowing
          hoverable
        >
          <Button.Group>
            <Button positive>Approve</Button>
            <Button.Or />
            <Button negative>Reject</Button>
          </Button.Group>
        </Popup>
      );
    }
  };

  _userProfileImage = (player) => {
    const imageUrl = _.get(player, 'user.profileImage.url');

    if (imageUrl) {
      return <img src={imageUrl} alt=""/>;
    } else {
      return <span className="glyphicon glyphicon-user" aria-hidden="true"/>;
    }
  };
}

export default compose(
  graphql(gamePlayersQuery, {
    options: ({ gameId }) => ({ variables: { gameId, status: ['game-master', 'pending', 'accepted'] } })
  }),
  ApolloLoader,
  pure,
)(GamePlayers);
