import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import { compose, pure } from "recompose";
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import {Tab, Tabs} from 'react-bootstrap';

import CreateLoungeMessage from './components/CreateLoungeMessage';
import CreateMessage from './components/CreateMessage';
import GameLoungeMessages from './components/GameLoungeMessages';
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

    <Tabs defaultActiveKey={1} animation={false} id="game-tabs">
      <Tab eventKey={1} title="Game Lounge">
        <CreateLoungeMessage gameId={game.id}/>
        <GameLoungeMessages gameId={game.id}/>
      </Tab>

      <Tab eventKey={2} title="Game Messages">
        <CreateMessage gameId={game.id}/>
        <GamesMessages gameId={game.id}/>
      </Tab>
    </Tabs>

  </div>;
}
