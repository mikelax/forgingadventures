import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Header, Button, Grid, Segment, Message } from 'semantic-ui-react';

import InlineItemsLoader from 'components/shared/InlineItemsLoader';
import RichEditor from 'components/shared/RichEditor';
import UberPaginator from 'components/shared/UberPaginator';

import { quote } from 'actions/gameMessage';

import DieRollResult from './DiceRollResult';
import GmHeader from './GmHeader';
import InCharacterHeader from './InCharacterHeader';
import OutOfCharacterHeader from './OutOfCharacterHeader';
import gameMessageStyles from './gameMessageStyles';

import { meQuery } from 'queries/users';

import {
  gameMessagesQuery, gameMessagesSummaryQuery, updateGameMessageMutation,
  onGameMessageAdded, onGameMessageUpdated
} from 'components/Games/queries';

import './GameMessages.styl';


export default function GameMessages(props) {
  const { gameId } = props;

  const summaryQuery = {
    query: gameMessagesSummaryQuery,
    variables: { gameId },
    dataKey: 'gameMessagesSummary.countMessages'
  };

  const itemsQuery = {
    query: gameMessagesQuery,
    variables: { gameId },
    dataKey: 'gameMessages'
  };

  return (
    <UberPaginator
      summaryQuery={summaryQuery}
      itemsQuery={itemsQuery}
    >
      {({ items, loading, subscribeToMore }) => (
        <Segment loading={loading}>
          <div className='game-messages'>
            <Header as="h1">Messages</Header>

            {_.isEmpty(items) && (
              <Message positive>
                <Message.Header>No Game messages yet</Message.Header>
                <p>
                  Be the first to post
                </p>
              </Message>
            )}

            <MessagesRenderer
              gameMessages={items}
              subscribeToMore={subscribeToMore}
              gameId={gameId}
            />
          </div>
        </Segment>
      )}
    </UberPaginator>
  );
}

class MessagesRenderer extends Component {

  componentDidMount() {
    this._setupSubscriptions();
  }

  render() {
    const { gameMessages } = this.props;

    return _.map(gameMessages, (gameMessage) => (
      <Segment key={`message-${gameMessage.id}`} className='game-message'>
        <GameMessageContainer gameMessage={gameMessage} />
      </Segment>
    ));

  }

  _setupSubscriptions() {
    const { gameId, subscribeToMore } = this.props;

    subscribeToMore({
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

    subscribeToMore({
      document: onGameMessageUpdated,
      variables: {
        gameId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const { messageUpdated } = subscriptionData.data;
        const oldMessageIndex = _.findIndex(prev.gameMessages, { id: messageUpdated.id });

        return _.map(prev.gameMessages, (gameMessage, index) => {
          if (index !== oldMessageIndex) {
            return gameMessage;
          } else {
            return {
              ...prev.gameMessages[oldMessageIndex],
              ...messageUpdated
            };
          }
        });
      }
    });

  }

}

/// private

class GameMessage extends Component {

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
    const { gameMessage, gameMessage: { meta, user } } = this.props;
    const { editing } = this.state;
    const rolls = _.get(meta, 'rolls');

    return (
      <Grid divided='vertically' className="in-character">
        <GmHeader user={user} />
        <Grid.Row columns={1}>
          <Grid.Column className="column-message">
            <RichEditor
              message={gameMessage.message}
              customStyles={gameMessageStyles}
              ref={this.editor}
              readOnly={!(editing)}
            />
          </Grid.Column>
        </Grid.Row>

        <InlineItemsLoader items={rolls}>
          <Grid.Row columns={1} className="slim">
            <Grid.Column>
              <DieRollResult rolls={rolls} />
            </Grid.Column>
          </Grid.Row>
        </InlineItemsLoader>

        <Grid.Row columns={2} className="slim" verticalAlign="middle">
          <Grid.Column>
            {this._messageControls(gameMessage.user.id)}
          </Grid.Column>
          <Grid.Column textAlign="right" className="column-info">
            Posted {this._relativeDate(gameMessage.createdAt)}
            {this._lastEdited()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  _inCharacterMessageRender = () => {
    const { gameMessage, gameMessage: { gameId, characterLog: { character, characterDetails }, meta } } = this.props;
    const { editing } = this.state;
    const rolls = _.get(meta, 'rolls');

    return (
      <Grid divided="vertically" className="in-character">
        <InCharacterHeader characterDetails={characterDetails} character={character} gameId={gameId} />
        <Grid.Row columns={1}>
          <Grid.Column className="column-message">
            <RichEditor
              message={gameMessage.message}
              ref={this.editor}
              readOnly={!(editing)}
              customStyles={gameMessageStyles}
            />
          </Grid.Column>
        </Grid.Row>

        <InlineItemsLoader items={rolls}>
          <Grid.Row columns={1} className="slim">
            <Grid.Column>
              <DieRollResult rolls={rolls} />
            </Grid.Column>
          </Grid.Row>
        </InlineItemsLoader>

        <Grid.Row columns={2} className="slim" verticalAlign="middle">
          <Grid.Column>
            {this._messageControls(gameMessage.user.id)}
          </Grid.Column>

          <Grid.Column textAlign="right" className="column-info">
            Posted {this._relativeDate(gameMessage.createdAt)}
            {this._lastEdited()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  _outOfCharacterMessageRender = () => {
    const { gameMessage, gameMessage: { meta, user } } = this.props;
    const { editing } = this.state;
    const rolls = _.get(meta, 'rolls');

    return (
      <Grid divided='vertically' className="out-character">
        <OutOfCharacterHeader user={user} />
        <Grid.Row columns={1}>
          <Grid.Column className="column-message">
            <RichEditor message={gameMessage.message} ref={this.editor} readOnly={!(editing)} />
          </Grid.Column>
        </Grid.Row>

        <InlineItemsLoader items={rolls}>
          <Grid.Row columns={1} className="slim">
            <Grid.Column>
              <DieRollResult rolls={rolls} />
            </Grid.Column>
          </Grid.Row>
        </InlineItemsLoader>

        <Grid.Row columns={2} className="slim" verticalAlign="middle">
          <Grid.Column>
            {this._messageControls(gameMessage.user.id)}
          </Grid.Column>
          <Grid.Column textAlign="right" className="column-info">
            Posted {this._relativeDate(gameMessage.createdAt)}
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
          <div className="last-edited">Updated {this._relativeDate(gameMessage.updatedAt)}</div>
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
)(GameMessage);
