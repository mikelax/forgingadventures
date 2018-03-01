import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import { Grid, Header, Label, Menu } from 'semantic-ui-react';

import { gamePlayersQuery, gameQuery, updateGameMutation } from '../queries';
import GamePlayers from '../View/components/GamePlayers';
import GameDetailsForm from '../components/GameDetailsForm';

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
  }
}

export default compose(
  graphql(gameQuery, {
    options: ( { match: { params: { id } } } ) => ({ variables: { id } })
  }),
  graphql(updateGameMutation, { name: 'updateGame' }),
  graphql(gamePlayersQuery, {
    name: 'gamePlayers',
    options: ( { match: { params: { id } } } ) => ({ variables: { gameId: id, status: ['game-master', 'pending', 'accepted'] } })
  })
)(EditGame);
