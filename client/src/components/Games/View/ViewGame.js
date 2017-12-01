import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { graphql } from 'react-apollo';

import { gameQuery } from '../queries';

class ViewGame extends Component {

  render() {
    const {match} = this.props;

    return <div className="game">
      <h1>Game</h1>

      <Link to={`${match.url}/list`}>
        Back to Games
      </Link>

      {this.content()}
    </div>
  }

  content = () => {
    const { data: { loading, error } } = this.props;

    switch(true) {
      case loading:
        return <p>Loading...</p>;
      case error:
        return <p>Error!</p>;
      default:
        { this.gameDetails() }
    }
  };

  gameDetails = () => {
    const { data: { game } } = this.props;


  };

}

export default graphql(gameQuery)(ViewGame);