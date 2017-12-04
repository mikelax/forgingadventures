import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { graphql } from 'react-apollo';

import { gamesQuery } from '../queries';
import ApolloLoader from '../../shared/components/ApolloLoader';
import { compose, pure } from "recompose";

class ListGames extends Component {

  render() {
    const {match} = this.props;

    return <div className="games-list">
      <h1>Games</h1>

      <Link to={`${match.url}/create`}>
        Create a new Game
      </Link>

      {this.content()}
    </div>
  }

  content = () => {
    const { data: { games } } = this.props;

    return <ul>
      {(games || []).map(({ id, title }) => (
        <li key={id}>{title}</li>
      ))}
    </ul>
  }
}

export default compose(
  graphql(gamesQuery),
  ApolloLoader,
  pure,
)(ListGames);
