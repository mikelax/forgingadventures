import _ from 'lodash';
import React, {Component} from 'react';
import {compose, pure} from "recompose";
import {graphql} from 'react-apollo';
import {Helmet} from "react-helmet";
import {Link} from 'react-router-dom';

import ApolloLoader from '../../shared/components/ApolloLoader';
import GameSearch from '../components/GameSearch';
import {gamesQuery} from '../queries';
import {postingFrequency, skillLevel} from '../utils/gameSettings';

import './ListGames.styl';

class ListGames extends Component {

  render() {
    const {match} = this.props;

    return <div className="ListGames">
      <Helmet>
        <title>Search For RPG Play by Post Games</title>
      </Helmet>

      <h1>Find a Game, start your Adventure</h1>

      <GameSearch onSearch={this.searchGames}/>

      <Link to={`${match.url}/create`}>
        Create a new Game
      </Link>

      {renderGames.call(this)}

    </div>;
  }

  searchGames = (searchParams) => {
    const {reload} = this.props;

    reload(searchParams);
  };

}

export default compose(
  graphql(gamesQuery, {
    props: ({ data, data: { refetch, fetchMore } }) => ({
      data,
      reload: (searchOptions) => {
        refetch({searchOptions});
      },
      loadMore: (searchOptions, page) => {
        fetchMore({
          variables:{
            page,
            searchOptions
          },
          updateQuery: () => {} //fixme - pagination
        });
      }
    }),
  }),
  ApolloLoader,
  pure,
)(ListGames);

/// private

function renderGames() {
  const {match, data: {games}} = this.props;

  return <div className="game-container">
    {_.map(games, (game) => (
      <GameDetails key={game.id} game={game} link={`${match.url}/${game.id}`}/>
    ))}
  </div>;
}

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
        Players: {game.gameSettings.minPlayers} / {game.gameSettings.maxPlayers}
      </div>
      <div className="skill">
        Skill: {skillLevel(game.gameSettings.skillLevel)}
      </div>
      <div className="frequency">
        Posting frequency: {postingFrequency(game.gameSettings.postingFrequency)}
      </div>
    </div>
  </div>;
};