import _ from 'lodash';
import moment from "moment";
import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {compose, pure} from "recompose";
import {Button} from 'react-bootstrap';

import GameMessage from '../../components/GameMessage';

import {
  gameMessagesQuery, updateGameMessageMutation,
  onGameMessageAdded, onGameMessageUpdated
} from '../../queries';

import ApolloLoader from '../../../shared/components/ApolloLoader';

class GameMessages extends Component {

  componentWillMount() {
    this._setupSubscriptions();
  }

  render() {
    const { data: { gameMessages } } = this.props;

    return <div className='game-messages'>
      <h1>Messages</h1>

      {_.map(gameMessages, (gameMessage) => (
        <div key={gameMessage.id} className='game-message'>
          <GameMessageContainer gameMessage={gameMessage} />
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

    data.subscribeToMore({
      document: onGameMessageUpdated,
      variables: {
        gameId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const {messageUpdated} = subscriptionData.data;

        _.chain(prev.gameMessages)
          .find({id: messageUpdated.id})
          .merge(messageUpdated)
          .value();

        return Object.assign({}, prev, {
          gameMessages: [...prev.gameMessages]
        });
      }
    });

  }

}

export default compose(
  graphql(gameMessagesQuery, {
    options: ({ gameId }) => ({ variables: { gameId } })
  }),
  ApolloLoader,
  pure,
)(GameMessages);

/// private

class GameMessageContainerBase extends Component {

  state = {
    editing: false
  };

  render() {
    const {gameMessage} = this.props;
    const {editing} = this.state;

    return (
      <div className="game-message">
        <div className="header">
          <div className="stats">
            <div className="message-stats">
              <div>Posted {this._relativeDate(gameMessage.created_at)}</div>
              {this._lastEdited()}
            </div>
          </div>
        </div>

        <div className="game-message-content">
          <GameMessage message={gameMessage.message} ref={c => (this.editor = c)} readOnly={!(editing)} />
        </div>

        <div className="editor-controls text-right">
          {this._messageControls()}
        </div>

      </div>
    );
  }

  ////// private

  _messageControls = () => {
    const {editing} = this.state;

    return editing ? this._editingControls() : this._viewingControls();
  };

  _viewingControls = () => {
    return <Button bsStyle="default" bsSize="xsmall" onClick={this._handleEdit}>edit</Button>;
  };

  _editingControls = () => {
    return <React.Fragment>
      <Button bsStyle="primary" onClick={this._handleSubmit}>Submit</Button>
      <Button onClick={this._handleCancel}>Cancel</Button>
    </React.Fragment>;
  };

  _handleEdit = () => {
    this.setState({editing: true});
  };

  _handleSubmit = () => {
    const {updateMessage, gameMessage} = this.props;

    return updateMessage({
      variables: {
        id: gameMessage.id,
        input: {
          message: this.editor.getEditorMessage()
        }
      }
    })
      .then(() => this.setState({editing: false}));
  };

  _handleCancel = () => {
    this.setState({editing: false});
  };

  _lastEdited = () => {
    const {gameMessage} = this.props;

    if (gameMessage.numberEdits) {
      return (
        <div className="edited">
          <div className="number-edits">Edits: {gameMessage.numberEdits}</div>
          <div className="last-edited">Updated {this._relativeDate(gameMessage.updated_at)}</div>
        </div>
      );
    } else {
      return null;
    }
  };

  _relativeDate = (date) => {
    const dateObject = moment(date);
    const dateDisplayRelative = dateObject.fromNow();
    const dateDisplayActual = dateObject.format('LLL');

    return <span className="date" title={dateDisplayActual}>{dateDisplayRelative}</span>;
  };

}

const GameMessageContainer = compose(
  graphql(updateGameMessageMutation, {
    name: 'updateMessage'
  }),
  pure,
)(GameMessageContainerBase);

