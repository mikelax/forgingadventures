import _ from 'lodash';
import moment from "moment";
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose, pure } from "recompose";
import { Header,  Comment, Icon } from 'semantic-ui-react';

import GameMessage from '../../components/GameMessage';

import {
  gameMessagesQuery, updateGameMessageMutation,
  onGameMessageAdded, onGameMessageUpdated
} from '../../queries';
import { meQuery } from '../../../../queries/users';

import ApolloLoader from '../../../shared/components/ApolloLoader';

class GameMessages extends Component {

  componentWillMount() {
    this._setupSubscriptions();
  }

  render() {
    const { data: { gameMessages } } = this.props;

    return <div className='game-messages'>
      <Header as="h1">Messages</Header>

      <Comment.Group>
        {_.map(gameMessages, (gameMessage) => (
          <div key={gameMessage.id} className='game-message'>
            <GameMessageContainer gameMessage={gameMessage} />
          </div>
        ))}
      </Comment.Group>
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

        const { messageUpdated } = subscriptionData.data;
        // fixme - this mutates the existing object. refactor
        // fixme - https://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html#updating-an-item-in-an-array
        _.chain(prev.gameMessages)
          .find({ id: messageUpdated.id })
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
    const { gameMessage } = this.props;
    const { editing } = this.state;

    return (
      <Comment>
        <Comment.Avatar><Icon name="user" /></Comment.Avatar>
        <Comment.Content>
          <Comment.Author>Character name</Comment.Author>
          <Comment.Metadata>
            <div>
              Posted {this._relativeDate(gameMessage.created_at)}
            </div>
            {this._lastEdited()}
          </Comment.Metadata>
          <Comment.Text>
            <GameMessage message={gameMessage.message} ref={c => (this.editor = c)} readOnly={!(editing)} />
          </Comment.Text>
          <Comment.Actions>
            {this._messageControls(gameMessage.user.id)}
          </Comment.Actions>
        </Comment.Content>
      </Comment>


      // <div className="game-message">
      //   <div className="header">
      //     <div className="stats">
      //       <div className="message-stats">
      //         <div>Posted {this._relativeDate(gameMessage.created_at)}</div>
      //         {this._lastEdited()}
      //       </div>
      //     </div>
      //   </div>
      //
      //   <div className="game-message-content">
      //     <GameMessage message={gameMessage.message} ref={c => (this.editor = c)} readOnly={!(editing)} />
      //   </div>
      //
      //   <div className="editor-controls text-right">
      //     {this._messageControls()}
      //   </div>
      //
      // </div>
    );
  }

  ////// private

  _messageControls = (messageUserId) => {
    const { editing } = this.state;

    return editing ? this._editingControls() : this._viewingControls(messageUserId);
  };

  _viewingControls = (messageUserId) => {
    const canEdit = _.eq(messageUserId, _.get(this.props.meQuery, 'me.id'));

    if (canEdit) {
      return (
        <Comment.Action onClick={this._handleEdit}>Edit</Comment.Action>
      );
    }
  };

  _editingControls = () => (
    <React.Fragment>
      <Comment.Action onClick={this._handleSubmit}>Update</Comment.Action>
      <Comment.Action onClick={this._handleCancel}>Cancel</Comment.Action>
    </React.Fragment>
  );

  _handleEdit = () => {
    this.setState({ editing: true });
  };

  _handleSubmit = () => {
    const { updateMessage, gameMessage } = this.props;

    return updateMessage({
      variables: {
        id: gameMessage.id,
        input: {
          message: this.editor.getEditorMessage()
        }
      }
    })
      .then(() => this.setState({ editing: false }));
  };

  _handleCancel = () => {
    this.setState({ editing: false });
  };

  _lastEdited = () => {
    const { gameMessage } = this.props;

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
    const dateDisplayRelative = dateObject.subtract(20,'s').fromNow(); //addresses possible db time skew
    const dateDisplayActual = dateObject.format('LLL');

    return <span className="date" title={dateDisplayActual}>{dateDisplayRelative}</span>;
  };

}

const GameMessageContainer = compose(
  graphql(updateGameMessageMutation, {
    name: 'updateMessage'
  }),
  graphql(meQuery, { name: 'meQuery' }),
  pure,
)(GameMessageContainerBase);

