import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose, pure } from 'recompose';
import { Button, Header, Image, Menu, Popup, Icon, Table } from 'semantic-ui-react';

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
        <Table selectable striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Player</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Game Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(gamePlayers, (player) => (
              <Table.Row key={player.id}>
                <Table.Cell>
                  <Header as='h3' image>
                    <Image avatar src={_.get(player, 'user.profileImage.url')} />
                    <Header.Content>
                        {player.user.name}
                      <Header.Subheader>{player.user.timezone}</Header.Subheader>
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>
                  { player.status === 'accepted' ? <Icon name='checkmark' /> : null }
                  {_.startCase(player.status)}
                </Table.Cell>
                <Table.Cell>
                  { isGm ? this._gmActions(player.id, player.status) : null }
                  { !isGm && _.some(myGamePlayer.myGamePlayer, (gp) => gp.user.id === player.user.id)
                      ? this._playerOptions(player.id) : null }
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
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
      const { gameId, updateGamePlayer } = this.props;
      const originalStatus = this.props.status;

      return updateGamePlayer({
        variables: {
          id: playerId,
          input: {
            status
          }
        },
        refetchQueries: [{
          query: gamePlayersQuery,
          variables: { gameId, status: originalStatus }
        }]
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
