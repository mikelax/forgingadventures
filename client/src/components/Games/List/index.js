import _ from 'lodash';
import React, {Component} from 'react';
import {compose, pure} from "recompose";
import {graphql} from 'react-apollo';
import {withRouter} from 'react-router';
import {connect} from "react-redux";
import {Helmet} from "react-helmet";
import {Link} from 'react-router-dom';
import Observer from 'react-intersection-observer';

import ApolloLoader from '../../shared/components/ApolloLoader';
import GameSearch from '../components/GameSearch';
import {gamesQuery} from '../queries';
import {postingFrequency, skillLevel} from '../utils/gameSettings';

import './ListGames.styl';
import {search} from "../../../actions/gamesSearch";

class ListGamesView extends Component {

  render() {
    const {match} = this.props;

    return <div className="ListGames">
      <Helmet>
        <title>Search For RPG Play by Post Games on Forging Adventures</title>
      </Helmet>

      <h1>Find a Game, start your Adventure</h1>

      <GameSearch onSearch={this.searchGames}/>

      <Link to={`${match.url}/create`}>
        Create a new Game
      </Link>

      <ListGames/>

    </div>;
  }

  searchGames = (searchParams) => {
    const {search} = this.props;

    search(searchParams);
  };

}

const mapDispatchToProps = dispatch => ({
  search: (searchParams) => dispatch(search(searchParams))
});


export default connect(
  null,
  mapDispatchToProps
)(ListGamesView);

/// private

class ListGamesPure extends Component {

  canPage = true;

  render() {
    const {match, data: {games}} = this.props;

    return <div className="game-container">
      <div className="games">
        {_.map(games, (game) => (
          <GameDetails key={game.id} game={game} link={`${match.url}/${game.id}`}/>
        ))}
      </div>

      <Observer onChange={this.loadMore}>
        <div className="in-view">&nbsp;</div>
      </Observer>
    </div>;
  }

  loadMore = (inView) => {
    const {fetchMore} = this.props;

    if (this.canPage && inView) {
      fetchMore()
        .then(({data: {games}}) => {
          if (_.isEmpty(games)) {
            this.canPage = false;
          }
        });
    }
  }
}

const ListGames = compose(
  withRouter,
  connect(
    (state) => ({gamesSearch: state.gamesSearch})
  ),
  graphql(gamesQuery, {
    options: ({gamesSearch}) => ({variables: {searchOptions: gamesSearch.searchParams, offset: 0}}),
    props: ({ data, data: { fetchMore } }) => {
      return {
        data,
        fetchMore() {
          return fetchMore({
            variables: {
              offset: data.games.length
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (_.isEmpty(fetchMoreResult)) { return prev; }

              return Object.assign({}, prev, {
                games: [...prev.games, ...fetchMoreResult.games],
              });
            },
          });
        }
      };
    }
  }),
  ApolloLoader,
  pure,
)(ListGamesPure);


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
