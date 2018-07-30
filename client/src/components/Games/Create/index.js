import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';

import { createGameMutation, gamesQuery } from '../queries';
import GameDetailsForm from '../components/GameDetailsForm';

class CreateGame extends Component {

  render() {

    return (
      <React.Fragment>
        <Helmet>
          <title>Create new Game on Forging Adventures</title>
        </Helmet>

        <div className="CreateGame">
          <h1>Create a New Game</h1>

          <GameDetailsForm onSave={this._onSave} onCancel={this._onCancel} />
        </div>
      </React.Fragment>

    );
  };

  _onCancel = () => {
    this.props.history.push('/games');
  };

  _onSave = (payload) => {
    const { createGame } = this.props;

    return createGame({
      variables: {
        input: payload
      },
      update: (store, { data: { createGame } }) => {
        // Read the data from our cache for this query.
        // the variables have to match in order for the new game to display
        const { games } = store.readQuery({
          query: gamesQuery,
          variables: { offset: 0, searchOptions: { textSearch: '', labelId: '0', gameSettings: {} } }
        });

        return store.writeQuery({
          query: gamesQuery,
          data: { games: [...games, createGame] },
          variables: { offset: 0, searchOptions: { textSearch: '', labelId: '0', gameSettings: {} } }
        });
      }
    })
      .then(() => this.props.history.replace('/games'));
  };
}

export default compose(
  graphql(createGameMutation, { name: 'createGame' })
)(CreateGame);
