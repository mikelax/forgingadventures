import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose, pure } from 'recompose';
import {Button} from 'react-bootstrap';
import GameLoungeMessage from '../../components/GameLoungeMessage/index';

import {
  gameLoungeMessagesQuery,
  updateGameLoungeMessageMutation,
  onGameLoungeMessageAdded,
  onGameLoungeMessageUpdated
} from '../../queries';
import ApolloLoader from '../../../shared/components/ApolloLoader';

import './assets/GameLoungeMessages.js.styl';

class GameLoungeMessages extends Component {

  componentWillMount() {
    this._setupSubscriptions();
  }

  render() {
    return <div className="game-lounge-messages">
      <h2>Lounge Messages</h2>

      {this.content()}
    </div>;
  }

  content = () => {
    const { data: { gameLoungeMessages } } = this.props;

    return <div>
      {_.map(gameLoungeMessages, (loungeMessage) => (
        <div key={loungeMessage.id} className='game-lounge-message-container'>
          <GameLoungeMessageContainerData loungeMessage={loungeMessage} />
        </div>
      ))}
    </div>;
  };

  _setupSubscriptions = () => {
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

    data.subscribeToMore({
      document: onGameLoungeMessageUpdated,
      variables: {
        gameId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const {gameLoungeMessageUpdated} = subscriptionData.data;

        _.chain(prev.gameLoungeMessages)
          .find({id: gameLoungeMessageUpdated.id})
          .merge(gameLoungeMessageUpdated)
          .value();


        return Object.assign({}, prev, {
          gameLoungeMessages: [...prev.gameLoungeMessages]
        });
      }
    });
  };
}

export default compose(
  graphql(gameLoungeMessagesQuery, {
    options: ({ gameId }) => ({ variables: { gameId } })
  }),
  ApolloLoader,
  pure,
)(GameLoungeMessages);

// private

class GameLoungeMessageContainer extends Component {

  state = {
    editing: false
  };

  render() {
    const {loungeMessage} = this.props;
    const {user} = loungeMessage;
    const {editing} = this.state;

    return (
      <div className="game-lounge-message">
        <div className="header">
          <div className="user-image">
            {this._userProfileImage()}
          </div>
          <div className="stats">
            <div className="message-info">
              Posted by {user.name}
            </div>
            <div className="message-stats">
              <div>Posted {this._relativeDate(loungeMessage.created_at)}</div>
              {this._lastEdited()}
            </div>
          </div>
        </div>

        <div className="game-lounge-message-content">
          <GameLoungeMessage message={loungeMessage.message} ref={c => (this.editor = c)} readOnly={!(editing)} />
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
    const {updateLoungeMessage, loungeMessage} = this.props;

    return updateLoungeMessage({
      variables: {
        id: loungeMessage.id,
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

  _userProfileImage = () => {
    const {loungeMessage: {user}} = this.props;
    const imageUrl = _.get(user, 'userMetadata.profileImage.imageUrl');

    if (imageUrl) {
      return <img src={user.userMetadata.profileImage.imageUrl} alt=""/>;
    } else {
      return <span className="glyphicon glyphicon glyphicon-user" aria-hidden="true"/>;
    }
  };

  _lastEdited = () => {
    const {loungeMessage} = this.props;

    if (loungeMessage.numberEdits) {
      return (
        <div className="edited">
          <div className="number-edits">Edits: {loungeMessage.numberEdits}</div>
          <div className="last-edited">Updated {this._relativeDate(loungeMessage.updated_at)}</div>
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

    return <span  className="date" title={dateDisplayActual}>{dateDisplayRelative}</span>;
  };
}

const GameLoungeMessageContainerData = compose(
  graphql(updateGameLoungeMessageMutation, {
    name: 'updateLoungeMessage'
  }),
  pure,
)(GameLoungeMessageContainer);
