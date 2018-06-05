import React from 'react';
import { Segment } from 'semantic-ui-react';

import CreateLoungeMessage from './components/CreateLoungeMessage';
import GameLoungeMessages from './components/GameLoungeMessages';

export default function GameLoungeMessagesView (props) {
  const { match: { params: { id } } } = props;

  return (
    <React.Fragment>
      <Segment className="rich-editor-sticky">
        <CreateLoungeMessage gameId={id}/>
      </Segment>

      <Segment>
        <GameLoungeMessages gameId={id}/>
      </Segment>
    </React.Fragment>
  );
}
