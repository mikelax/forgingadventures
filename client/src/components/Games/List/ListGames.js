import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { compose, pure } from "recompose";

import { gamesQuery } from '../queries';
import ApolloLoader from '../../shared/components/ApolloLoader';

class ListGames extends Component {

  render() {
    const {match} = this.props;

    return <div className="ListGames">
      <h1>Games</h1>

      <Link to={`${match.url}/create`}>
        Create a new Game
      </Link>

      {this.content()}
    </div>;
  }

  content = () => {
    const { match, data: { games } } = this.props;

    return <ul>
      {_.each(games).map(({ id, title }) => (
        <li key={id}>
          <Link to={`${match.url}/${id}`}>
            {title}
          </Link>
        </li>
      ))}
    </ul>;
  }
}

export default compose(
  graphql(gamesQuery),
  ApolloLoader,
  pure,
)(ListGames);
