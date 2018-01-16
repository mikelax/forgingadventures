import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo/index';
import { compose, pure } from "recompose";
import {Tab, Tabs} from 'react-bootstrap';

import CreateMessage from './CreateMessage';
import CreateLoungeMessage from './CreateLoungeMessage';
import GamesMessages from './GameMessages';
import GameLoungeMessages from './GameLoungeMessages';
import ApolloLoader from '../../shared/components/ApolloLoader';

import { gameQuery } from '../queries';
import './assets/ViewGame.styl';


class ViewGame extends Component {

  render() {
    return <div className="ViewGame">
      <h1>Game</h1>

      <Link to='/games'>
        Back to Games
      </Link>

      {gameDetails.call(this)}
    </div>;
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

    <Tabs defaultActiveKey={2} animation={false} id="game-tabs">
      <Tab eventKey={1} title="Game Messages">
        <CreateMessage gameId={game.id}/>
        <GamesMessages gameId={game.id}/>
      </Tab>

      <Tab eventKey={2} title="Game Lounge">
        <CreateLoungeMessage gameId={game.id}/>
        <GameLoungeMessages gameId={game.id}/>
      </Tab>
    </Tabs>

  </div>;
}
