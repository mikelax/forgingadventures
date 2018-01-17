import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose, pure } from 'recompose';
import GameLoungeMessage from '../../components/GameLoungeMessage/index';

import { gameLoungeMessagesQuery, onGameLoungeMessageAdded } from '../../queries';
import ApolloLoader from '../../../shared/components/ApolloLoader';

class GameLoungeMessages extends Component {

  componentWillMount() {
    const { gameId, data } = this.props;

    data.subscribeToMore({
      document: onGameLoungeMessageAdded,
      variables: {
        gameId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newMessage = subscriptionData.data.gameLoungeMessageAdded;

        return Object.assign({}, prev, {
          gameLoungeMessages: [...prev.gameLoungeMessages, newMessage]
        });
      }
    });
  }

  render() {
    return <div className="game-lounge-messages-container">
      <h1>Messages</h1>

      {this.content()}
    </div>;
  }

  content = () => {
    const { data: { gameLoungeMessages } } = this.props;

    return <div className='game-messages'>
      {_.map(gameLoungeMessages, ({ id, message }) => (
        <div key={id} className='game-lounge-message'>
          <GameLoungeMessage message={message} readOnly={true} />
        </div>
      ))}
    </div>;
  }
}

export default compose(
  graphql(gameLoungeMessagesQuery, {
    options: ({ gameId }) => ({ variables: { gameId } })
  }),
  ApolloLoader,
  pure,
)(GameLoungeMessages);
