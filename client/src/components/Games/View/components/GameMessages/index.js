import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose, pure } from 'recompose';
import { connect } from 'react-redux';
import { Header, Button, Grid, Segment } from 'semantic-ui-react';

import ApolloLoader from 'components/shared/components/ApolloLoader';
import RichEditor from 'components/shared/components/RichEditor';
import { quote } from 'actions/gameMessage';

import GmHeader from './GmHeader';
import InCharacterHeader from './InCharacterHeader';
import OutOfCharacterHeader from './OutOfCharacterHeader';

import { meQuery } from 'queries/users';

import {
  gameMessagesQuery, updateGameMessageMutation,
  onGameMessageAdded, onGameMessageUpdated
} from 'components/Games/queries';

import './GameMessages.styl';

class GameMessages extends Component {

  componentWillMount() {
    this._setupSubscriptions();
  }

  render() {
    const { data: { gameMessages } } = this.props;

    return <div className='game-messages'>
      <Header as="h1">Messages</Header>

      {_.map(gameMessages, (gameMessage) => (
        <Segment key={`message-${gameMessage.id}`} className='game-message'>
          <GameMessageContainer gameMessage={gameMessage}/>
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
)(GameMessages);

/// private

class GameMessageContainerBase extends Component {

  state = {
    editing: false
  };

  editor = React.createRef();

  render() {
    const { gameMessage: { postType } } = this.props;
    const messageRenderer = {
      gm: this._gmMessageRender,
      ic: this._inCharacterMessageRender,
      ooc: this._outOfCharacterMessageRender
    }[postType];

    return messageRenderer();
  }

  ////// private

  _gmMessageRender = () => {
    const { gameMessage, gameMessage: { user } } = this.props;
    const { editing } = this.state;

    return (
      <Grid divided='vertically' className="in-character">
        <GmHeader user={user} />
        <Grid.Row>
          <Grid.Column className="column-message">
            <RichEditor message={gameMessage.message} ref={this.editor} readOnly={!(editing)} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2} className="slim" verticalAlign="middle">
          <Grid.Column>
            {this._messageControls(gameMessage.user.id)}
          </Grid.Column>
          <Grid.Column textAlign="right" className="column-info">
            Posted {this._relativeDate(gameMessage.created_at)}
            {this._lastEdited()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  _inCharacterMessageRender = () => {
    const { editing } = this.state;

    const { gameMessage, gameMessage: { character } } = this.props;

    return (
      <Grid divided="vertically" className="in-character">
        <InCharacterHeader character={character}/>

        <Grid.Row columns={1}>
          <Grid.Column className="column-message">
            <RichEditor message={gameMessage.message} ref={this.editor} readOnly={!(editing)}/>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2} className="slim" verticalAlign="middle">
          <Grid.Column>
            {this._messageControls(gameMessage.user.id)}
          </Grid.Column>

          <Grid.Column textAlign="right" className="column-info">
            Posted {this._relativeDate(gameMessage.created_at)}
            {this._lastEdited()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  _outOfCharacterMessageRender = () => {
    const { gameMessage, gameMessage: { user } } = this.props;
    const { editing } = this.state;

    return (
      <Grid divided='vertically' className="out-character">
        <OutOfCharacterHeader user={user}/>
        <Grid.Row>
          <Grid.Column className="column-message">
            <RichEditor message={gameMessage.message} ref={this.editor} readOnly={!(editing)}/>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2} className="slim" verticalAlign="middle">
          <Grid.Column>
            {this._messageControls(gameMessage.user.id)}
          </Grid.Column>
          <Grid.Column textAlign="right" className="column-info">
            Posted {this._relativeDate(gameMessage.created_at)}
            {this._lastEdited()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
          {canEdit && <Button size="tiny" compact={true} onClick={this._handleEdit}>Edit</Button>}
          <Button size="tiny" compact={true} onClick={this._handleQuote}>Quote</Button>
        </React.Fragment>
      );
    }
  };

  _editingControls = () => (
    <React.Fragment>
      <Button size="tiny" onClick={this._handleSubmit}>Update</Button>
      <Button size="tiny" onClick={this._handleCancel}>Cancel</Button>
    </React.Fragment>
  );

  _handleEdit = () => {
    this.setState({ editing: true });
  };

  _handleQuote = () => {
    const { quoteGameMessage, gameMessage } = this.props;

    quoteGameMessage(gameMessage);
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
          <div className="last-edited">Updated {this._relativeDate(gameMessage.updated_at)}</div>
          <div className="number-edits">Edits: {gameMessage.numberEdits}</div>
        </div>
      );
    } else {
      return null;
    }
  };

  _relativeDate = (date) => {
    const dateObject = moment(date);
    const dateDisplayRelative = dateObject.subtract(20, 's').fromNow(); //addresses possible db time skew
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
