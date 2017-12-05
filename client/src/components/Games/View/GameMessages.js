import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose, pure } from "recompose";

import { gameMessagesQuery, onGameMessageAdded } from '../queries';
import ApolloLoader from '../../shared/components/ApolloLoader';

class GameMessages extends Component {

  componentWillMount() {
    const { gameId, data } = this.props;

    data.subscribeToMore({
      document: onGameMessageAdded,
      variables: {
        gameId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newMessage = subscriptionData.data.messageAdded;

        return Object.assign({}, prev, {
          gameMessages: [newMessage, ...prev.gameMessages]
        });
      }
    })
  }

  render() {
    return <div className="games-messages-container">
      <h1>Messages</h1>

      {this.content()}
    </div>
  }

  content = () => {
    const { data: { gameMessages } } = this.props;

    return <div className='game-messages'>
      {_.each(gameMessages).map(({ id, message }) => (
        <div key={id} className='game-message'>
          {message}
        </div>
      ))}
    </div>
  }
}

export default compose(
  graphql(gameMessagesQuery, {
    options: ({ gameId }) => ({ variables: { gameId } })
  }),
  ApolloLoader,
  pure,
)(GameMessages);
