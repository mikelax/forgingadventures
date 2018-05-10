import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Comment, Header, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

import RichEditor from '../../../shared/components/RichEditor';
import { quote } from '../../../../actions/loungeMessage';

import {
  gameLoungeMessagesQuery,
  updateGameLoungeMessageMutation,
  onGameLoungeMessageAdded,
  onGameLoungeMessageUpdated
} from '../../queries';
import { meQuery } from '../../../../queries/users';

import ApolloLoader from '../../../shared/components/ApolloLoader';

import './assets/gameLoungeMessages.styl';

class GameLoungeMessages extends Component {

  componentWillMount() {
    this._setupSubscriptions();
  }

  render() {
    const { data: { gameLoungeMessages } } = this.props;

    if (_.get(gameLoungeMessages, 'length')) {
      return <div className="game-lounge-messages">
        <Header as="h2" dividing>Lounge Messages</Header>
        {this.content()}
      </div>;
    } else {
      return null;
    }

  }

  content = () => {
    const { data: { gameLoungeMessages } } = this.props;

    return (
      <Comment.Group>
        {_.map(gameLoungeMessages, (loungeMessage) => (
            <GameLoungeMessageContainerData key={loungeMessage.id} loungeMessage={loungeMessage} />
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

        const { gameLoungeMessageUpdated } = subscriptionData.data;
        // fixme - this mutates the existing object. refactor
        // fixme - https://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html#updating-an-item-in-an-array
        _.chain(prev.gameLoungeMessages)
          .find({ id: gameLoungeMessageUpdated.id })
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
)(GameLoungeMessages);

// private

class GameLoungeMessageContainer extends Component {

  state = {
    editing: false
  };

  editor = React.createRef();

  render() {
    const { loungeMessage } = this.props;
    const { user } = loungeMessage;
    const { editing } = this.state;

    return (
      <Comment>
        {this._userProfileImage()}
        <Comment.Content>
          <Comment.Author>{user.name}</Comment.Author>
          <Comment.Metadata>
            {this._lastEdited()}
            <div>
              Posted {this._relativeDate(loungeMessage.created_at)}
            </div>
          </Comment.Metadata>
          {this._renderMeta()}
          <Comment.Text>
            <RichEditor message={loungeMessage.message} ref={this.editor} readOnly={!(editing)} />
          </Comment.Text>
          <Comment.Actions>
            {this._messageControls(user.id)}
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    );
  }

  ////// private

  _messageControls = (messageUserId) => {
    const { editing } = this.state;

    return editing ? this._editingControls() : this._viewingControls(messageUserId);
  };

  _renderMeta = () => {
    const { editing } = this.state;
    const { loungeMessage } = this.props;
    const { user } = loungeMessage;

    if (!(editing)) {
      if (loungeMessage.meta === 'join') {
        return (
          <div className="meta"><Icon name="user plus" color="green"/>{user.name} has joined the game!</div>
        );
      }
    }
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
    const { quoteLoungeMessage, loungeMessage } = this.props;

    quoteLoungeMessage(loungeMessage);
  };

  _handleSubmit = () => {
    const { updateLoungeMessage, loungeMessage } = this.props;

    return updateLoungeMessage({
      variables: {
        id: loungeMessage.id,
        input: {
          message: this.editor.current.getEditorMessage()
        }
      }
    })
      .then(() => this.setState({ editing: false }));
  };

  _handleCancel = () => {
    this.setState({ editing: false });
  };

  _userProfileImage = () => {
    const { loungeMessage: { user } } = this.props;
    const imageUrl = _.get(user, 'profileImage.url');

    if (imageUrl) {
      return <Comment.Avatar src={imageUrl} />;
    } else {
      return <Comment.Avatar><Icon name="user" /></Comment.Avatar>;
    }
  };

  _lastEdited = () => {
    const { loungeMessage } = this.props;

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

const mapDispatchToProps = dispatch => ({
  quoteLoungeMessage: (message) => dispatch(quote(message))
});

const GameLoungeMessageContainerData = compose(
  graphql(updateGameLoungeMessageMutation, {
    name: 'updateLoungeMessage'
  }),
  graphql(meQuery, { name: 'meQuery' }),
  connect(null, mapDispatchToProps, null, { pure: false })
)(GameLoungeMessageContainer);
