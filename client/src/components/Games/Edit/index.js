import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import { Button, Form, Grid, Header, Label, Menu, Statistic } from 'semantic-ui-react';

import { gamePlayersQuery, gameQuery, updateGameMutation, updateGameStatusMutation } from '../queries';
import GamePlayers from '../View/components/GamePlayers';
import GameDetailsForm from '../components/GameDetailsForm';

import OwnerGuard from '../../shared/components/OwnerGuard';
import { gameStatus, gameStatuses } from '../utils/gameSettings';

class EditGame extends Component {
  state = { activeItem: 'details' };

  render() {
    const { activeItem } = this.state;
    const title = _.get(this.props, 'data.game.title');
    const playerCounts = _.groupBy(_.get(this.props, 'gamePlayers.gamePlayers'), 'status');
    const content = this._getActiveContent();

    return (
      <React.Fragment>
        <Helmet>
          <title>{`Editing ${title}`}</title>
        </Helmet>

        <div className="EditGame">
          <Header
            as='h1'
            content='Edit Game'
          />

          <Grid>
            <Grid.Column width={3}>
              <Menu fluid vertical tabular>
                <Menu.Item name='details' active={activeItem === 'details'} onClick={this._handleMenuClick} />
                <Menu.Item>
                  <Menu.Header>Players</Menu.Header>
                  <Menu.Menu>
                    <Menu.Item name='gameGM' active={activeItem === 'gameGM'} onClick={this._handleMenuClick}>
                      <Label>{_.size(playerCounts['game-master'])}</Label>
                      GM
                    </Menu.Item>
                    <Menu.Item name='acceptedPlayers' active={activeItem === 'acceptedPlayers'} onClick={this._handleMenuClick}>
                      <Label>{_.size(playerCounts['accepted'])}</Label>
                      Accepted
                    </Menu.Item>
                    <Menu.Item name='pendingPlayers' active={activeItem === 'pendingPlayers'} onClick={this._handleMenuClick}>
                      <Label>{_.size(playerCounts['pending'])}</Label>
                      Pending
                    </Menu.Item>
                  </Menu.Menu>
                </Menu.Item>
                <Menu.Item name='status' active={activeItem === 'status'} onClick={this._handleMenuClick} />
              </Menu>
            </Grid.Column>

            <Grid.Column stretched width={13}>
              {content}
            </Grid.Column>
          </Grid>
        </div>
      </React.Fragment>
    );
  };

  _handleMenuClick = (e, { name }) => this.setState({ activeItem: name });

  _getActiveContent = () => {
    const game = _.get(this.props, 'data.game');
    const loading = _.get(this.props, 'data.loading');
    const gameId = _.get(this.props, 'data.game.id');
    const playerCounts = _.groupBy(_.get(this.props, 'gamePlayers.gamePlayers'), 'status');
    let content;

    switch(this.state.activeItem) {
      case 'gameGM':
        content = <GamePlayers gameId={gameId} status={['game-master']} />;
        break;
      case 'pendingPlayers':
        content = <GamePlayers gameId={gameId} status={['pending']} />;
        break;
      case 'acceptedPlayers':
        content = <GamePlayers gameId={gameId} status={['accepted']} />;
        break;
      case 'status':
        content = <GameStatus onSave={this._onGameStatusSave} game={game} playerCount={_.size(playerCounts['accepted'])} />;
        break;
      case 'details':
      default:
        content = <GameDetailsForm onSave={this._onSave} game={game} loading={loading} onCancel={this._cancel} />;
        break;
    }

    return content;
  };

  _cancel = () => {
    const { match: { params: { id } } } = this.props;

    this.props.history.push(`/games/${id}`);
  };

  _onSave = (payload) => {
    const { match: { params: { id } }, updateGame } = this.props;

    return updateGame({
        variables: {
          id: id,
          input: payload
        }
      })
      .then(() => this.props.history.replace(`/games/${id}`));
  };

  _onGameStatusSave = (gameStatus) => {
    const { match: { params: { id } }, updateGameStatus } = this.props;

    return updateGameStatus({
        variables: {
          id,
          gameStatus
        }
      });
  }
}

class GameStatus extends Component {
  render() {
    const { game, playerCount } = this.props;
    const countColor = playerCount >= game.gameSettings.minPlayers && playerCount <= game.gameSettings.maxPlayers ?
    'green' : 'red';

    return (
      <React.Fragment>
        <Header as='h2'>
          Current Game Status: { gameStatus(game.gameSettings.gameStatus) }
        </Header>

        <Statistic horizontal color={countColor} label='Current Players' value={playerCount} />

        <Form>
          <Form.Group inline>
              <Form.Field>
                <label>Status</label>
                <Form.Field
                  as="select"
                  defaultValue={game.gameSettings.gameStatus}
                  onChange={(e) => this.setState({ 'status': e.target.value })}>
                  {
                    _.map(gameStatuses, (desc, level) =>
                      <option key={level} value={level}>{desc}</option>
                    )
                  }
                </Form.Field>
              </Form.Field>
            </Form.Group>

            <Button primary onClick={this._submit} size="tiny" type="submit">
              Update Game Status
            </Button>
          </Form>
      </React.Fragment>
    );
  };

  _submit = () => {
    const { onSave } = this.props;

    return onSave(Number(this.state.status));
  };
}

export default compose(
  graphql(gameQuery, {
    options: ( { match: { params: { id } } } ) => ({ variables: { id } })
  }),
  graphql(updateGameMutation, { name: 'updateGame' }),
  graphql(updateGameStatusMutation, { name: 'updateGameStatus' }),
  graphql(gamePlayersQuery, {
    name: 'gamePlayers',
    options: ( { match: { params: { id } } } ) => ({ variables: { gameId: id, status: ['game-master', 'pending', 'accepted'] } })
  }),
  OwnerGuard('data.game.user.id')
)(EditGame);
