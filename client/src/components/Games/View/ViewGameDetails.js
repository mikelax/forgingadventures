import _ from 'lodash';
import React from 'react';
import { Container, Segment, Header, Label, Button, Message } from 'semantic-ui-react';
import { compose, pure } from 'recompose';
import { graphql } from 'react-apollo';

import GameHeader from './GameHeader';
import GamePlayers from './components/GamePlayers';

import ApolloLoader from 'components/shared/ApolloLoader';

import { gameQuery, myGamePlayerQuery } from '../queries';

function GameDetailsView(props) {
  const { data: { game } } = props;

  return (
    <React.Fragment>
      <GameHeader game={game} />

      <Segment>
        <Header as='h2' dividing>
          Scenario
          <Header.Subheader>
            <Label color='red'>{game.label.displayName}</Label> {game.scenario}
          </Header.Subheader>
        </Header>

        <Header as='h2' dividing>
          Overview
          <Header.Subheader>
            <div dangerouslySetInnerHTML={{ __html: game.overview }}/>
          </Header.Subheader>
        </Header>

        <div className="joinGame">{joinGame(props)}</div>
      </Segment>

      <Segment>
        <GamePlayers gameId={game.id} status={['game-master', 'pending', 'accepted']}/>
      </Segment>
    </React.Fragment>
  );
}

export default compose(
  graphql(gameQuery, {
    options: ( { match: { params: { id } } } ) => ({ variables: { id } })
  }),
  graphql(myGamePlayerQuery, {
    name: 'myGamePlayerQuery',
    options: ( { match: { params: { id } } } ) => ({ variables: { gameId: id } })
  }),
  ApolloLoader,
  pure,
)(GameDetailsView);

function joinGame(props) {
  const canJoin = canJoinGame(props);

  if (canJoin) {
    return (
      <Container textAlign='right'>
        <Button primary href={`${props.match.url}/join`}>
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

function canJoinGame(props) {
  const myGamePlayer = _.get(props, 'myGamePlayerQuery.myGamePlayer');
  // check if player was previously in game but left for some reason, allow option to join again
  const canRejoin = _.every(myGamePlayer, (value) => {
    return _.includes(['rejected', 'quit', 'kicked'], value.status);
  });

  return _.isEmpty(myGamePlayer) || canRejoin;
}
