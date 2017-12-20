import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo/index';
import { compose, pure } from "recompose";

import { gameQuery } from '../queries';

import CreateMessage from './CreateMessage';
import GamesMessages from './GameMessages';
import ApolloLoader from '../../shared/components/ApolloLoader';

class ViewGame extends Component {

  render() {
    return <div className="ViewGame">
      <h1>Game</h1>

      <Link to='/games'>
        Back to Games
      </Link>

      {this.content()}
    </div>;
  }

  content = () => {
    const { data: { game } } = this.props;

    return <div>
      <div>title: {game.title}</div>
      <div>scenario: {game.scenario}</div>
      <div>overview: {game.overview}</div>

      <CreateMessage gameId={game.id}></CreateMessage>

      <GamesMessages gameId={game.id}></GamesMessages>
    </div>;
  };

}

export default compose(
  graphql(gameQuery, {
    options: ( { match: { params: { id } } } ) => ({ variables: { id } })
  }),
  ApolloLoader,
  pure,
)(ViewGame);
