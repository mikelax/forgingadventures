import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo/index';
import { compose, pure } from "recompose";

import { gameQuery } from '../queries';
import ApolloLoader from '../../shared/components/ApolloLoader';

class ViewGame extends Component {

  render() {
    return <div className="game">
      <h1>Game</h1>

      <Link to='/games'>
        Back to Games
      </Link>

      {this.content()}
    </div>
  }

  content = () => {
    const { data: { game } } = this.props;

    return <div>
      <div>title: {game.title}</div>
      <div>scenario: {game.scenario}</div>
      <div>overview: {game.overview}</div>
    </div>

  };

}

export default compose(
  graphql(gameQuery, {
    options: ( { match: { params: { id } } } ) => ({ variables: { id } })
  }),
  ApolloLoader,
  pure,
)(ViewGame);
