import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose, pure } from "recompose";
import { Button, Image, List, Menu, Popup, Icon } from 'semantic-ui-react';

import { gamePlayersQuery, myGamePlayerQuery, updateGamePlayerMutation } from '../../queries';
import ApolloLoader from '../../../shared/components/ApolloLoader';

import './assets/GamePlayers.styl';

class GamePlayers extends Component {

  static propTypes = {
    gameId: PropTypes.string.isRequired,
    status: PropTypes.array
  };

  render() {
    const { data: { gamePlayers }, myGamePlayer } = this.props;
    // INFO using _.some here as myGamePlayer returns an array for future proofing
    // ie. in case user has multiple characters in single game
    const isGm = _.some(myGamePlayer.myGamePlayer, ['status', 'game-master']);

    return (
      <div className="GamePlayers">
        <List divided verticalAlign='middle'>
          {_.map(gamePlayers, (player) => (
            <List.Item key={player.id}>
              <List.Content floated='right'>
                { isGm ? this._gmActions(player.id, player.status) : null }
                { !isGm && _.some(myGamePlayer.myGamePlayer, (gp) => gp.user.id === player.user.id)
                    ? this._playerOptions(player.id) : null }
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

  _gmActions = (playerId, playerStatus) => {
    if (playerStatus === 'pending') {
      return (
        <Popup
          trigger={<Button icon><Icon name="setting" /></Button>}
          flowing
          hoverable
        >
          <Button.Group>
            <Button positive onClick={this._updatePlayerStatus(playerId, 'accepted')}>Approve</Button>
            <Button.Or />
            <Button negative onClick={this._updatePlayerStatus(playerId, 'rejected')}>Reject</Button>
          </Button.Group>
        </Popup>
      );
    } else if (playerStatus === 'accepted') {
      return (
        <Popup
          trigger={<Button icon><Icon name="setting" /></Button>}
          flowing
          hoverable
        >
          <Menu vertical compact size="tiny">
            <Menu.Item onClick={this._updatePlayerStatus(playerId, 'kicked')}>
              <Icon name="remove" />
              Kick Player
            </Menu.Item>
          </Menu>
        </Popup>
      );
    }
  };

  _playerOptions = (playerId) => {
    return (
        <Popup
          trigger={<Button icon><Icon name="setting" /></Button>}
          flowing
          hoverable
        >
          <Menu vertical compact size="tiny">
            <Menu.Item onClick={this._updatePlayerStatus(playerId, 'quit')}>
              <Icon name="remove" />
              Leave Game
            </Menu.Item>
          </Menu>
        </Popup>
    );
  };

  _userProfileImage = (player) => {
    const imageUrl = _.get(player, 'user.profileImage.url');

    if (imageUrl) {
      return <img src={imageUrl} alt=""/>;
    } else {
      return <span className="glyphicon glyphicon-user" aria-hidden="true"/>;
    }
  };

  _updatePlayerStatus = (playerId, status) => {
    return (e) => {
      const { updateGamePlayer } = this.props;

      return updateGamePlayer({
        variables: {
          id: playerId,
          input: {
            status
          }
        }
      });
    };
  };
}

export default compose(
  graphql(myGamePlayerQuery, {
    name: 'myGamePlayer',
    options: ({ gameId }) => ({ variables: { gameId } })
  }),
  graphql(gamePlayersQuery, {
    options: ({ gameId, status }) => ({ variables: { gameId, status } })
  }),
  graphql(updateGamePlayerMutation, {
    name: 'updateGamePlayer'
  }),
  ApolloLoader,
  pure,
)(GamePlayers);
