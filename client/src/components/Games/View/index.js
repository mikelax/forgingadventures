import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo/index';
import {Helmet} from "react-helmet";
import { compose, pure } from "recompose";

import CreateMessage from './components/CreateMessage';
import GamesMessages from './components/GameMessages';
import ApolloLoader from '../../shared/components/ApolloLoader';

import { gameQuery } from '../queries';
import './assets/ViewGame.styl';


class ViewGame extends Component {

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>{this.props.data.game.title} on Forging Adventures</title>
        </Helmet>

        <div className="ViewGame">
          <h1>Game</h1>

          <Link to='/games'>
            Back to Games
          </Link>

          {gameDetails.call(this)}
        </div>
      </React.Fragment>
    );
  }

}

export default compose(
  graphql(gameQuery, {
    options: ( { match: { params: { id } } } ) => ({ variables: { id } })
  }),
  ApolloLoader,
  pure,
)(ViewGame);

///// private

function gameDetails() {
  const { data: { game } } = this.props;

  return <div>
    <h2>{game.title}</h2>
    <h3 className="scenario">{game.scenario}</h3>

    <div className="overview">{game.overview}</div>

    <CreateMessage gameId={game.id}/>

    <GamesMessages gameId={game.id}/>
  </div>;
}
