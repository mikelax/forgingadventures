import PropTypes from 'prop-types';
import React from 'react';
import { Message, Segment } from 'semantic-ui-react';
import { graphql } from 'react-apollo/index';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import GameHeader from './GameHeader';
import CreateLoungeMessage from './components/CreateLoungeMessage';
import GameLoungeMessages from './components/GameLoungeMessages';

import { gameQuery } from '../queries';

function GameLoungeMessagesView (props) {
  const { match: { params: { id } }, data: { game }, authorisation: { isAuthenticated } } = props;

  return (
    <React.Fragment>
      <GameHeader game={game} />

      <GameLoungeMessages gameId={id}/>

      <Segment>
        { isAuthenticated && <CreateLoungeMessage gameId={id}/> }
        { !isAuthenticated && <LoginToPostMessage /> }
      </Segment>
    </React.Fragment>
  );
}

GameLoungeMessagesView.propTypes = {
  authorisation: PropTypes.shape({
    isAuthenticated: PropTypes.bool.isRequired
  }).isRequired
};

const LoginToPostMessage = () => (
  <Message
    info
    header='Please Login to Post'
    content='While the Game Lounge is viewable by everyone, you must be logged in to post a new Message.'
  />
);

const mapStateToProps = state => ({
  authorisation: state.authorisation
});

export default compose(
  connect(mapStateToProps),
  graphql(gameQuery, {
    options: ( { match: { params: { id } } } ) => ({ variables: { id } })
  }),
)(GameLoungeMessagesView);
