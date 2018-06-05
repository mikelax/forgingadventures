import _ from 'lodash';
import React from 'react';
import { Message, Segment } from 'semantic-ui-react';
import { compose, pure } from 'recompose';

import { graphql } from 'react-apollo';

import CreateMessage from './components/GameMessages/CreateMessage';
import GamesMessages from './components/GameMessages';

import ApolloLoader from '../../shared/components/ApolloLoader';
import { gameQuery, myGamePlayerQuery } from '../queries';

function ViewGameMessages(props) {
  const { data: { game } } = props;
  const myGamePlayer = _.get(props, 'myGamePlayerQuery.myGamePlayer');
  const playerOrGm = !_.isEmpty(myGamePlayer) && _.some(myGamePlayer, (value) => {
    return _.includes(['game-master', 'accepted'], value.status);
  });

  const editorBlock = playerOrGm ?
    <CreateMessage gameId={game.id}/> :
    <Message info
             header='Please Login or Join Game to Post'
             content='While games are viewable by everyone, only players are able to post Game Messages. Try posting a message in the Game Lounge, or searching for another open game.'
    />;

  return (
    <React.Fragment>
      <Segment>
        {editorBlock}
      </Segment>

      <Segment>
        <GamesMessages gameId={game.id}/>
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
