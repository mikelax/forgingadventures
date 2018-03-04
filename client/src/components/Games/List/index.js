import _ from 'lodash';
import React, { Component } from 'react';
import { compose, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, Header, Icon, Segment } from 'semantic-ui-react';
import Observer from 'react-intersection-observer';

import GameCard from '../components/GameCard';
import GameSearch from '../components/GameSearch';
import { gamesQuery } from '../queries';

import { search } from '../../../actions/gamesSearch';

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
    const { data: { games, loading } } = this.props;

    return (
      <Segment basic loading={loading}>
        <Card.Group stackable={true} itemsPerRow={3}>
          {_.map(games, (game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </Card.Group>

        <Observer onChange={this._loadMore}>
          <div className="in-view">&nbsp;</div>
        </Observer>
      </Segment>
    );
  }

  _loadMore = (inView) => {
    const { fetchMore, data: { loading } } = this.props;

    if (this.canPage && inView && !(loading)) {
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
              offset: _.get(data, 'games.length', 0)
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
  pure,
)(ListGamesPure);
