import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Header, Image, Menu, Popup, Icon, Table, Modal } from 'semantic-ui-react';

import CharactersSelect from 'components/shared/CharactersSelect';
import ApolloLoader from 'components/shared/ApolloLoader';
import { UserImageAvatar, CharacterImageAvatar } from 'components/shared/ProfileImageAvatar';
import { getFullImageUrl } from 'services/image';

import { gamePlayersQuery, myGamePlayerQuery, updateGamePlayerMutation } from '../../queries';

import './assets/GamePlayers.styl';

class GamePlayers extends Component {

  static propTypes = {
    gameId: PropTypes.string.isRequired,
    status: PropTypes.array
  };

  state = {
    characterModal: false
  };

  render() {
    const { data: { gamePlayers }, myGamePlayer, me } = this.props;
    const { characterModal } = this.state;
    // INFO using _.some here as myGamePlayer returns an array for future proofing
    // ie. in case user has multiple characters in single game
    const isGm = _.some(myGamePlayer.myGamePlayer, ['status', 'game-master']);

    return (
      <div className="GamePlayers">
        <Table selectable striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Player</Table.HeaderCell>
              <Table.HeaderCell>Character</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Game Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(gamePlayers, (gamePlayer) => (
              <Table.Row key={gamePlayer.id}>
                <Table.Cell>
                  <Header as='h3' image>
                    <UserImageAvatar user={gamePlayer.user} className="ui avatar image"/>
                    <Header.Content>
                        {gamePlayer.user.name}
                      <Header.Subheader>{gamePlayer.user.timezone}</Header.Subheader>
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>
                  {this._characterCell(gamePlayer)}
                </Table.Cell>
                <Table.Cell>
                  { gamePlayer.status === 'accepted' ? <Icon name='checkmark' /> : null }
                  {_.startCase(gamePlayer.status)}
                </Table.Cell>
                <Table.Cell>
                  { isGm ? this._gmActions(gamePlayer.id, gamePlayer.status) : null }
                  { !isGm && gamePlayer.user.id === _.get(me, 'me.id')
                      ? this._playerOptions(gamePlayer) : null }
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <SelectCharacterModal
          open={characterModal}
          onSelectedCharacter={this._updatePlayerCharacter}
          onClose={this._closeSelectCharacterModal}
        />
      </div>
    );
  }

  ////// private

  _gmActions = (playerId, playerStatus) => {
    const gameId = this.props.gameId;

    if (playerStatus === 'game-master') {
      return (
        <Popup
          trigger={<Button icon><Icon name="setting" /></Button>}
          flowing
          hoverable
        >
          <Menu vertical compact size="tiny">
            <Menu.Item as={Link} link to={`/games/${gameId}/edit`}>
              Edit Game <Icon name="edit" />
            </Menu.Item>
          </Menu>
        </Popup>
      );
    } else if (playerStatus === 'pending') {
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

  _playerOptions = (gamePlayer) => {
    const { character, id: playerId } = gamePlayer;

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

            {
              _.isEmpty(character) && (
                <Menu.Item onClick={this._selectCharacter(playerId)}>
                  <Icon name="add" />
                  Select a Character
                </Menu.Item>
              )
            }
          </Menu>
        </Popup>
    );
  };

  _characterCell = (player) => {
    const { character } = player;
    const name = _.get(character, 'name');
    const playerUserId = _.get(player, 'user.id');
    const currentUserId = _.get(this.props, 'me.me.id');
    const needsCharacter = _.isEmpty(character) && (playerUserId === currentUserId);

    if (player.status === 'game-master') {
      return <Header as='h3' content='N/A' />;
    } else if (player.character === null) {
      return (
        <React.Fragment>
          <Header as='h3'>
            {
              needsCharacter && <Button as="a" href="/characters/create" size="mini" floated="right">Create Character</Button>
            }
            <span>
              <Icon name="warning" />
              Still working on it
            </span>
          </Header>
        </React.Fragment>
      );
    } else {
      return (
        <Header as='h3' image>
          <CharacterImageAvatar character={character} className="avatar image ui" />
          <Header.Content>
              {name}
          </Header.Content>
        </Header>
      );
    }
  };

  _updatePlayerStatus = (playerId, status) => {
    return () => {
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

  _updatePlayerCharacter = (characterId) => {
    const { gameId, updateGamePlayer, status } = this.props;
    const playerId = this.state.modalPlayerId;

    return updateGamePlayer({
      variables: {
        id: playerId,
        input: {
          characterId
        }
      },
      refetchQueries: [{
        query: gamePlayersQuery,
        variables: { gameId, status: status }
      }]
    });
  };

  _selectCharacter = (playerId) => {
    return () => {
      this.setState({
        characterModal: true,
        modalPlayerId: playerId
      });
    };
  };

  _closeSelectCharacterModal = () => {
    this.setState({
      characterModal: false,
      modalPlayerId: null
    });
  };
}

class SelectCharacterModal extends Component {

  static propTypes = {
    open: PropTypes.bool,
    onSelectedCharacter: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    characterId: null
  };

  render() {
    const { open } = this.props;

    return (
      <Modal
        open={open}
        onClose={this._onClose}
        size='mini'
      >
        <Modal.Header>
          Select a Character for this Game
        </Modal.Header>
        <Modal.Content>
          <CharactersSelect
            value={this.state.characterId}
            onChange={this._selectCharacter}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this._onClose} content='Cancel' />
          <Button primary onClick={this._onSelect} icon='checkmark' labelPosition='right' content='Select' />
        </Modal.Actions>
      </Modal>
    );
  }

  _onSelect = () => {
    const { onSelectedCharacter, onClose } = this.props;

    onSelectedCharacter(this.state.characterId);
    onClose();
  };

  _onClose = () => {
    this.props.onClose();
  };

  _selectCharacter = (character) => {
    const value = _.get(character, 'value', null);
    this.setState({ characterId: value });
  };
}

const mapStateToProps = state => ({
  me: state.me
});


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
  connect(mapStateToProps),
  ApolloLoader,
)(GamePlayers);
