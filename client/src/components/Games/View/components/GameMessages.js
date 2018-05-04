import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose, pure } from 'recompose';
import { connect } from 'react-redux';
import { Header,  Comment, Icon } from 'semantic-ui-react';

import RichEditor from '../../../shared/components/RichEditor';
import ApolloLoader from '../../../shared/components/ApolloLoader';
import { quote } from '../../../../actions/gameMessage';

import {
  gameMessagesQuery, updateGameMessageMutation,
  onGameMessageAdded, onGameMessageUpdated
} from '../../queries';
import { meQuery } from '../../../../queries/users';


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
    const { gameMessage: { postType } } = this.props;
    const messageRenderer = {
      ic: this._inCharacterMessageRender,
      ooc: this._outOfCharacterMessageRender
    }[postType];

    return messageRenderer();
  }

  ////// private

  _inCharacterMessageRender = () => {
    const { gameMessage } = this.props;
    const { editing } = this.state;

    return (
      <Comment>
        {characterProfileImage()}
        <Comment.Content>
          <Comment.Author>{gameMessage.character.name}</Comment.Author>
          <Comment.Metadata>
            <div>
              Posted {this._relativeDate(gameMessage.created_at)}
            </div>
            {this._lastEdited()}
          </Comment.Metadata>
          <Comment.Text>
            <RichEditor message={gameMessage.message} ref={c => (this.editor = c)} readOnly={!(editing)} />
          </Comment.Text>
          <Comment.Actions>
            {this._messageControls(gameMessage.user.id)}
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    );

    function characterProfileImage() {
      const characterUrl = _.get(gameMessage, 'character.profileImage.url');

      if (characterUrl) {
        return <Comment.Avatar src={characterUrl} />;
      } else {
        return <Comment.Avatar><Icon name="user" /></Comment.Avatar>;
      }
    }
  };

  _outOfCharacterMessageRender = () => {
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
            <RichEditor message={gameMessage.message} ref={c => (this.editor = c)} readOnly={!(editing)} />
          </Comment.Text>
          <Comment.Actions>
            {this._messageControls(gameMessage.user.id)}
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    );
  };

  _messageControls = (messageUserId) => {
    const { editing } = this.state;

    return editing ? this._editingControls() : this._viewingControls(messageUserId);
  };

  _viewingControls = (messageUserId) => {
    const canEdit = _.eq(messageUserId, _.get(this.props.meQuery, 'me.id'));
    const canPost = _.get(this.props, ('meQuery.me.id'));

    if (canPost) {
      return (
        <React.Fragment>
          { canEdit && <Comment.Action onClick={this._handleEdit}>Edit</Comment.Action> }
          <Comment.Action onClick={this._handleQuote}>Quote</Comment.Action>
        </React.Fragment>
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

  _handleQuote = () => {
    const { quoteGameMessage } = this.props;

    quoteGameMessage(this.editor.getEditorMessage());
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

const mapDispatchToProps = dispatch => ({
  quoteGameMessage: (message) => dispatch(quote(message))
});


const GameMessageContainer = compose(
  graphql(updateGameMessageMutation, {
    name: 'updateMessage'
  }),
  graphql(meQuery, { name: 'meQuery' }),
  connect(null, mapDispatchToProps, null, { pure: false }),
)(GameMessageContainerBase);

