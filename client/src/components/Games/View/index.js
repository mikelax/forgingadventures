import _ from 'lodash';
import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import { compose, pure } from "recompose";
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Button, Breadcrumb, Tab, Segment, Header, Container, Message } from 'semantic-ui-react';

import CreateLoungeMessage from './components/CreateLoungeMessage';
import CreateMessage from './components/CreateMessage';
import GameLoungeMessages from './components/GameLoungeMessages';
import GamesMessages from './components/GameMessages';
import GamePlayers from './components/GamePlayers';

import ApolloLoader from '../../shared/components/ApolloLoader';

import { gameQuery, myGamePlayerQuery } from '../queries';
import { meQuery } from '../../../queries/users';

import './assets/ViewGame.styl';


class ViewGame extends Component {

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>{this.props.data.game.title} on Forging Adventures</title>
        </Helmet>

        <div className="ViewGame">
          <Segment>
            <Breadcrumb>
              <Breadcrumb.Section as={Link} to="/">Home</Breadcrumb.Section>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section as={Link} to="/games">Games</Breadcrumb.Section>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section active>{this.props.data.game.title}</Breadcrumb.Section>
            </Breadcrumb>
          </Segment>

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
  graphql(meQuery, {
    name: 'meQuery'
  }),
  graphql(myGamePlayerQuery, {
    name: 'myGamePlayerQuery',
    options: ( { match: { params: { id } } } ) => ({ variables: { gameId: id } })
  }),
  ApolloLoader,
  pure,
)(ViewGame);

///// private

function gameDetails() {
  const { data: { game } } = this.props;
  const panes = [
    { menuItem: 'Game Lounge', render: () => <Tab.Pane>
        <CreateLoungeMessage gameId={game.id}/>
        <GameLoungeMessages gameId={game.id}/>
      </Tab.Pane> },
    { menuItem: 'Players', render: () => <Tab.Pane>
        <GamePlayers gameId={game.id}/>
      </Tab.Pane> },
    { menuItem: 'Game Messages', render: () => <Tab.Pane>
        <CreateMessage gameId={game.id}/>
        <GamesMessages gameId={game.id}/>
      </Tab.Pane> }
  ];

  return <div>
    <Header as='h2' dividing>
      Scenario
      <Header.Subheader>
        {game.scenario}
      </Header.Subheader>
    </Header>

    <Header as='h2' dividing>
      Overview
      <Header.Subheader>
        {game.overview}
      </Header.Subheader>
    </Header>

    <div className="joinGame">{joinGame.call(this)}</div>

    <Tab menu={{pointing: true}} panes={panes}/>
  </div>;
}

function joinGame() {
  const canJoin = canJoinGame.call(this);

  if (canJoin) {
    return (
      <Container textAlign='right'>
        <Button primary href={`${this.props.match.url}/join`}>
          Join Game
        </Button>
      </Container>
    );
  } else {
    return (
      <Message info>
        You've Joined this game.
      </Message>
    );
  }
}

function canJoinGame() {
  const myGamePlayer = _.get(this.props, 'myGamePlayerQuery.myGamePlayer');
  return _.isEmpty(myGamePlayer);
}
