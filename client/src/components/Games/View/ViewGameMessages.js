import _ from 'lodash';
import React from 'react';
import { Message, Segment } from 'semantic-ui-react';
import { compose, pure } from 'recompose';

import { graphql } from 'react-apollo';

import GameHeader from './GameHeader';
import CreateMessage from './components/GameMessages/CreateMessage';
import GameMessages from './components/GameMessages';
import { gameQuery, myGamePlayerQuery } from '../queries';

import ApolloLoader from 'components/shared/ApolloLoader';

function ViewGameMessages(props) {
  const { data: { game } } = props;
  const myGamePlayer = _.get(props, 'myGamePlayerQuery.myGamePlayer');

  return (
    <React.Fragment>
      <GameHeader game={game} />

      <GameMessages gameId={_.toInteger(game.id)}/>

      <Segment>
        <EditorBlock myGamePlayer={myGamePlayer} game={game}/>
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
)(ViewGameMessages);


function EditorBlock(props) {
  const { myGamePlayer, game } = props;

  const isGm = _.some(myGamePlayer, (value) => {
    return _.includes(['game-master'], value.status);
  });

  const isPlayerWithCharacter = _.some(myGamePlayer, (value) => {
    return _.includes(['accepted'], value.status) &&
      !(_.isEmpty(value.character));
  });

  const isPlayerWithoutCharacter = _.some(myGamePlayer, (value) => {
    return _.includes(['accepted'], value.status) &&
      _.isEmpty(value.character);
  });

  const showCreateMessage = isGm || isPlayerWithCharacter;

  if (showCreateMessage) {
    return <CreateMessage gameId={game.id}/>;
  } else if (isPlayerWithoutCharacter) {
    return <AddCharacterMessage />;
  } else {
    return <JoinGameMessage />;
  }
}

function AddCharacterMessage() {
  return (
    <Message
      info
      header='Please assign a character to post Game Messages'
      content='You can view existing Game Messages but can only create a Game Message once you have chosen a character.'
    />
  );
}

function JoinGameMessage() {
  return (
    <Message
      info
      header='Please Login or Join Game to Post'
      content='While games are viewable by everyone, only players are able to post Game Messages. Try posting a message in the Game Lounge, or searching for another open game.'
    />
  );
}
