import _ from 'lodash';
import React, { Component } from 'react';
import { compose, pure } from "recompose";
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { Card, Header, Icon, Image } from 'semantic-ui-react';
import Observer from 'react-intersection-observer';

import ApolloLoader from '../../shared/components/ApolloLoader';
import GameSearch from '../components/GameSearch';
import { gamesQuery } from '../queries';
import { postingFrequency, skillLevel } from '../utils/gameSettings';

import { search } from "../../../actions/gamesSearch";
import dragons from './dragons.jpg';

class ListGamesView extends Component {

  render() {
    const { match } = this.props;

    return <div className="ListGames">
      <Helmet>
        <title>Search For RPG Play by Post Games on Forging Adventures</title>
      </Helmet>

      <Header
        as='h1'
        content='Find a Game, start your Adventure'
      />

      <GameSearch onSearch={this.searchGames}/>

      <Header as='h2'>
        <Icon name='add'/>
        <Header.Content>
          <Link to={`${match.url}/create`}>
            Create a new Game
          </Link>
        </Header.Content>
      </Header>

      <Header as='h3' dividing>
        Existing Games
      </Header>

      <ListGames/>

    </div>;
  }

  searchGames = (searchParams) => {
    const { search } = this.props;

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
    const { match, data: { games } } = this.props;

    return <div>
      <Card.Group stackable={true} itemsPerRow={4}>
        {_.map(games, (game) => (
          <GameDetails key={game.id} game={game} link={`${match.url}/${game.id}`}/>
        ))}
      </Card.Group>

      <Observer onChange={this.loadMore}>
        <div className="in-view">&nbsp;</div>
      </Observer>
    </div>;
  }

  loadMore = (inView) => {
    const { fetchMore } = this.props;

    if (this.canPage && inView) {
      fetchMore()
        .then(({ data: { games } }) => {
          if (_.isEmpty(games)) {
            this.canPage = false;
          }
        });
    }
  };
}

const ListGames = compose(
  withRouter,
  connect(
    (state) => ({ gamesSearch: state.gamesSearch })
  ),
  graphql(gamesQuery, {
    options: ({ gamesSearch }) => ({ variables: { searchOptions: gamesSearch.searchParams, offset: 0 } }),
    props: ({ data, data: { fetchMore } }) => {
      return {
        data,
        fetchMore() {
          return fetchMore({
            variables: {
              offset: data.games.length
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (_.isEmpty(fetchMoreResult)) {
                return prev;
              }

              return Object.assign({}, prev, {
                games: [...prev.games, ...fetchMoreResult.games]
              });
            }
          });
        }
      };
    }
  }),
  ApolloLoader,
  pure,
)(ListGamesPure);


const GameDetails = (props) => {
  const { game } = props;
  const imageSrc = _.get(game, 'gameImage.url') || dragons;

  return (
    <Card>
      <Image src={imageSrc} />
      <Card.Content>
        <Card.Header>
          <Link to={props.link}> {game.title}</Link>
        </Card.Header>
        <Card.Meta>
          {game.scenario}
        </Card.Meta>
        <Card.Description>
          {game.overview}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div>
          <Icon name='group'/>
          {game.gameSettings.minPlayers} to {game.gameSettings.maxPlayers} players
        </div>
        <div>
          <Icon name='student'/>
          {skillLevel(game.gameSettings.skillLevel)}
        </div>
        <div>
          <Icon name='clock'/>
          {postingFrequency(game.gameSettings.postingFrequency)}
        </div>
      </Card.Content>
    </Card>
  );
};
