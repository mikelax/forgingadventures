import React from 'react';
import { Segment } from 'semantic-ui-react';
import { graphql } from 'react-apollo/index';
import { compose, pure } from 'recompose';

import GameHeader from './GameHeader';
import CreateLoungeMessage from './components/CreateLoungeMessage';
import GameLoungeMessages from './components/GameLoungeMessages';

import { gameQuery } from '../queries';

function GameLoungeMessagesView (props) {
  const { match: { params: { id } }, data: { game } } = props;

  return (
    <React.Fragment>
      <GameHeader game={game} />

      <GameLoungeMessages gameId={id}/>

      <Segment>
        <CreateLoungeMessage gameId={id}/>
      </Segment>
    </React.Fragment>
  );
}

export default compose(
  graphql(gameQuery, {
    options: ( { match: { params: { id } } } ) => ({ variables: { id } })
  }),
  pure,
)(GameLoungeMessagesView);
