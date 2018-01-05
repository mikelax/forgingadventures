import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { compose, pure } from "recompose";

import { gamesQuery } from '../queries';
import { skillLevel, postingFrequency } from '../utils/gameSettings';
import ApolloLoader from '../../shared/components/ApolloLoader';

import './ListGames.styl';

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

    return <ul className="list-unstyled">
      {_.map(games, (game) => (
        <li key={game.id} className="game-container">
          <GameDetails game={game} link={`${match.url}/${game.id}`}/>
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

/// private

const GameDetails = (props) => {
  const {game} = props;
  return <div className="game-card">
    <div className="header">
      <div className="title">
        <Link to={props.link}> {game.title}</Link>
      </div>
    </div>

    <div className="details">
      <div className="scenario">
        {game.scenario}
      </div>
      <div className="overview">
        {game.overview}
      </div>
    </div>

    <div className="game-settings">
      <div className="players">
        Players: { game.gameSettings.minPlayers } / { game.gameSettings.maxPlayers }
      </div>
      <div className="skill">
        Skill: { skillLevel(game.gameSettings.skillLevel) }
      </div>
      <div className="frequency">
        Posting frequency: { postingFrequency(game.gameSettings.postingFrequency) }
      </div>
    </div>
  </div>;
};