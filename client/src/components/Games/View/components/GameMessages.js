import _ from 'lodash';
import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {compose, pure} from "recompose";
import GameMessage from '../../components/GameMessage/index';

import {gameMessagesQuery, updateGameMessageMutation, onGameMessageAdded} from '../../queries';

import ApolloLoader from '../../../shared/components/ApolloLoader';

export default class GameMessagesView extends Component {

  render() {
    const {gameId} = this.props;

    return <div className="games-messages-container">
      <h1>Messages</h1>

      <GameMessages gameId={gameId}/>
    </div>;
  }

}

class GameMessageBase extends Component {

  componentWillMount() {
    this._setupSubscriptions();
  }

  render() {
    const { data: { gameMessages } } = this.props;

    return <div className='game-messages'>
      {_.map(gameMessages, ({ id, message, numberEdits }) => (
        <div key={id} className='game-message'>
          <GameMessage message={message} numberEdits={numberEdits} readOnly={true} onChanged={this._setMessage(id)} />
        </div>
      ))}
    </div>;
  }

  _setupSubscriptions() {
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
          gameMessages: [...prev.gameMessages, newMessage]
        });
      }
    });

    // TODO subscribe to message updated message

  }

  _setMessage = (messageId) => ({message}) => {
    const {updateMessage} = this.props;

    return updateMessage({
      variables: {
        id: messageId,
        input: {
          message
        }
      }
    });
  }

}

const GameMessages = compose(
  graphql(gameMessagesQuery, {
    options: ({ gameId }) => ({ variables: { gameId } })
  }),
  graphql(updateGameMessageMutation, {
    name: 'updateMessage'
  }),
  ApolloLoader,
  pure,
)(GameMessageBase);
