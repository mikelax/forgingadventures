import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose, pure } from 'recompose';
import { connect } from 'react-redux';
import { Header, Comment, Icon, Grid, Image, Segment } from 'semantic-ui-react';

import RichEditor from 'components/shared/components/RichEditor/index';
import ApolloLoader from 'components/shared/components/ApolloLoader';
import { quote } from 'actions/gameMessage';

import { meQuery } from 'queries/users';

import {
  primaryAttributes as dnd5PrimaryAttributes,
  secondaryAttributes as dnd5SecondaryAttributes
} from './CharacterLabelGameMessageHeaders/1_5e';

import {
  primaryAttributes as pfPrimaryAttributes,
  secondaryAttributes as pfSecondaryAttributes
} from './CharacterLabelGameMessageHeaders/2_pathFinder';

import {
  gameMessagesQuery, updateGameMessageMutation,
  onGameMessageAdded, onGameMessageUpdated
} from 'components/Games/queries';

import './GameMessages.styl';

class Index extends Component {

  componentWillMount() {
    this._setupSubscriptions();
  }

  render() {
    const { data: { gameMessages } } = this.props;

    return <div className='game-messages'>
      <Header as="h1">Messages</Header>

      {_.map(gameMessages, (gameMessage) => (
        <Segment key={`message-${gameMessage.id}`}>
          <div className='game-message'>
            <GameMessageContainer gameMessage={gameMessage} />
          </div>
        </Segment>
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
)(Index);

/// private

class GameMessageContainerBase extends Component {

  state = {
    editing: false
  };

  editor = React.createRef();

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
    const { editing } = this.state;

    const { gameMessage } = this.props;
    const { gameMessage: { game: { labelId }, character } } = this.props;
    const PrimaryAttributes = {
      1: dnd5PrimaryAttributes,
      2: pfPrimaryAttributes
    }[labelId];
    const SecondaryAttributes = {
      1: dnd5SecondaryAttributes,
      2: pfSecondaryAttributes
    }[labelId];

    return (
      <Grid divided="vertically">
        <Grid.Row columns={2} className="message-header">
          <Grid.Column width={2} textAlign="center" verticalAlign="middle">
            {characterProfileImage()}
          </Grid.Column>

          <Grid.Column width={14} verticalAlign="middle">
            <Grid>
              <Grid.Row columns={1}>
                <Grid.Column className="character-name">
                  {character.name}
                </Grid.Column>
                <Grid.Column>
                  <PrimaryAttributes character={character}/>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row className="slim">
         <Grid.Column>
            <SecondaryAttributes character={character}/>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={1}>
          <Grid.Column>
            <RichEditor message={gameMessage.message} ref={this.editor} readOnly={!(editing)} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column>
            {this._messageControls(gameMessage.user.id)}
          </Grid.Column>
          <Grid.Column>
            Posted {this._relativeDate(gameMessage.created_at)}
            {this._lastEdited()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );

    function characterProfileImage() {
      const characterUrl = _.get(gameMessage, 'character.profileImage.url');

      if (characterUrl) {
        return <Image avatar size="tiny" src={characterUrl} />;
      } else {
        return <Icon name="user" size="tiny"/>;
      }
    }
  };

  _outOfCharacterMessageRender = () => {
    const { gameMessage } = this.props;
    const { editing } = this.state;

    return (
      <Grid divided='vertically'>
        <Grid.Row columns={2}>
          <Grid.Column width={2} textAlign="center" verticalAlign="middle">
            {userProfileImage()}
          </Grid.Column>
          <Grid.Column className="user-name" width={14} verticalAlign="middle">
            {gameMessage.user.name}
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={1}>
          <Grid.Column>
            <RichEditor message={gameMessage.message} ref={this.editor} readOnly={!(editing)} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column>
            {this._messageControls(gameMessage.user.id)}
          </Grid.Column>
          <Grid.Column>
            Posted {this._relativeDate(gameMessage.created_at)}
            {this._lastEdited()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );

    function userProfileImage() {
      const profileImageUrl = _.get(gameMessage, 'user.profileImage.url');

      if (profileImageUrl) {
        return <Image avatar size="tiny" src={profileImageUrl} />;
      } else {
        return <Icon name="user" size="tiny" />;
      }
    }
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

    quoteGameMessage(this.editor.current.getEditorMessage());
  };

  _handleSubmit = () => {
    const { updateMessage, gameMessage } = this.props;

    return updateMessage({
      variables: {
        id: gameMessage.id,
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

