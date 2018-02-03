import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose, pure } from 'recompose';
import { Comment, Header } from 'semantic-ui-react';
import GameLoungeMessage from '../../components/GameLoungeMessage';

import {
  gameLoungeMessagesQuery,
  updateGameLoungeMessageMutation,
  onGameLoungeMessageAdded,
  onGameLoungeMessageUpdated
} from '../../queries';

import ApolloLoader from '../../../shared/components/ApolloLoader';

class GameLoungeMessages extends Component {

  componentWillMount() {
    this._setupSubscriptions();
  }

  render() {
    return <div className="game-lounge-messages">
      <Header as="h2" dividing>Lounge Messages</Header>

      {this.content()}
    </div>;
  }

  content = () => {
    const { data: { gameLoungeMessages } } = this.props;

    return (  
      <Comment.Group>
        {_.map(gameLoungeMessages, (loungeMessage) => (
            <GameLoungeMessageContainerData loungeMessage={loungeMessage} />
        ))}
      </Comment.Group>
    );
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
        // fixme - this mutates the existing object. refactor
        // fixme - https://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html#updating-an-item-in-an-array
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
      <Comment>
        <Comment.Avatar as='a' src={this._userProfileImage()} />
        <Comment.Content>
          <Comment.Author>{user.name}</Comment.Author>
          <Comment.Metadata>
            <div>
              Posted {this._relativeDate(loungeMessage.created_at)}
            </div>
            {this._lastEdited()}
          </Comment.Metadata>
          <Comment.Text>
            <GameLoungeMessage message={loungeMessage.message} ref={c => (this.editor = c)} readOnly={!(editing)} />
          </Comment.Text>
          <Comment.Actions>
            {this._messageControls()}
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    );
  }

  ////// private

  _messageControls = () => {
    const {editing} = this.state;

    return editing ? this._editingControls() : this._viewingControls();
  };

  _viewingControls = () => (
    <Comment.Action onClick={this._handleEdit}>Edit</Comment.Action> 
  )

  _editingControls = () => (
    <React.Fragment>
      <Comment.Action onClick={this._handleSubmit}>Update</Comment.Action>
      <Comment.Action onClick={this._handleCancel}>Cancel</Comment.Action>
    </React.Fragment>
  )

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
    const imageUrl = _.get(user, 'profileImage.url');

    if (imageUrl) {
      return <img src={imageUrl} alt=""/>;
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
    const dateDisplayRelative = dateObject.subtract(20,'s').fromNow(); // addresses clock skew on DB
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
