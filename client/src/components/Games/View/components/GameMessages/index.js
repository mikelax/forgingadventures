import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql, Query, Mutation } from 'react-apollo';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Button, Divider, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react';

import InlineItemsLoader from 'components/shared/InlineItemsLoader';
import RichEditor from 'components/shared/RichEditor';
import UberPaginator from 'components/shared/UberPaginator';

import { quote } from 'actions/gameMessage';

import DieRollResult from './DiceRollResult';
import GmHeader from './GmHeader';
import InCharacterHeader from './InCharacterHeader';
import OutOfCharacterHeader from './OutOfCharacterHeader';
import gameMessageStyles from './gameMessageStyles';

import { Consumer } from '../../ViewGameMessagesContext';

import { meQuery } from 'queries/users';

import {
  gameMessagesQuery, gameMessagesSummaryQuery, updateGameMessageMutation,
  onGameMessageAdded, onGameMessageUpdated, myGamePlayerQuery,
  setGameMessageProgressMutation
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

GameMessages.propTypes = {
  gameId: PropTypes.string.isRequired
};

class MessagesRenderer extends Component {

  componentDidMount() {
    this._setupSubscriptions();
  }

  render() {
    const { gameMessages, gameId } = this.props;

    return (
      <Query
        query={myGamePlayerQuery}
        variables={{ gameId }}
      >
        {({ data: myGamePlayerData }) => (
          <Query
            query={meQuery}
          >
            {({ data: meQueryData }) => {
              return _.map(gameMessages, (gameMessage) => (
                <React.Fragment key={`message-${gameMessage.id}`} >
                  <Segment className='game-message'>
                    <GameMessageContainer
                      gameMessage={gameMessage}
                      isMemberOfGame={this._isMemberOfGame(meQueryData, myGamePlayerData)}
                      isCurrentUserMessage={this._messageBelongsToCurrentUser(gameMessage, meQueryData)}
                    />
                  </Segment>

                  <GameMessageReadProgressIndicator
                    gameMessage={gameMessage}
                  />
                </React.Fragment>
              ));
            }}
          </Query>

        )}
      </Query>
    );

  }

  _isMemberOfGame = _.memoize((meQueryData, myGamePlayerData) => {
    const { myGamePlayer } = myGamePlayerData;
    const currentUserId = _.get(meQueryData, 'me.id');

    return _.some(myGamePlayer, mgp =>
      Number(mgp.user.id) === Number(currentUserId)
        && _.includes(['accepted', 'game-master'], mgp.status)
    );
  });

  _messageBelongsToCurrentUser = (gameMessage, meQueryData) => {
    const { user: { id: userId } } = gameMessage;
    const currentUserId = _.get(meQueryData, 'me.id');

    return Number(userId) === Number(currentUserId);
  };

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
      icm: this._inCharacterMessageRender,
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
            {this._messageControls()}
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
    const { isCurrentUserMessage } = this.props;
    const { editing } = this.state;
    const rolls = _.get(meta, 'rolls');

    return (
      <Grid divided="vertically" className="in-character">
        <InCharacterHeader
          characterDetails={characterDetails}
          character={character}
          gameId={gameId}
          characterEditEnabled={isCurrentUserMessage}
        />

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
            {this._messageControls()}
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
            {this._messageControls()}
          </Grid.Column>
          <Grid.Column textAlign="right" className="column-info">
            Posted {this._relativeDate(gameMessage.createdAt)}
            {this._lastEdited()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  _messageControls = () => {
    const { editing } = this.state;

    return editing ? this._editingControls() : this._viewingControls();
  };

  _viewingControls = () => {
    const { isCurrentUserMessage, isMemberOfGame, gameMessage } = this.props;
    const canEdit = isCurrentUserMessage && this._editableMessage();

    if (isMemberOfGame) {
      return (
        <React.Fragment>
          {canEdit && <Button size="tiny" compact onClick={this._handleEdit}><Icon name='edit outline' />Edit</Button>}
          <Button size="tiny" compact onClick={this._handleQuote}><Icon name='quote left' />Quote</Button>

          <span className="divider" />
          <SetGameMessageProgressButton gameMessage={gameMessage} />
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

  _editableMessage = () => {
    const { gameMessage: { postType } } = this.props;

    return postType !== 'icm';
  };

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

function SetGameMessageProgressButton(props) {
  const { gameMessage: { id: gameMessageId } } = props;

  return (
    <Consumer>
      {({ myGamePlayer }) => {
        const [{ id: gamePlayerId, progressGameMessageId }] = myGamePlayer;
        const showProgressButtons = gameMessageId > (progressGameMessageId || 0);

        return showProgressButtons && (
          <Mutation mutation={setGameMessageProgressMutation}>
            {(setGameMessageProgress, { loading }) => (
              <Button compact size="tiny" loading={loading}
                onClick={() => setGameMessageProgress({ variables: { gamePlayerId, gameMessageId } })}
              >
                <Icon name='check' />Mark Read
              </Button>
            )}
          </Mutation>
        );
      }}
    </Consumer>
  );
}

function GameMessageReadProgressIndicator(props) {
  const { gameMessage: { id: gameMessageId } } = props;

  return (
    <Consumer>
      {({ gamePlayers }) => {
        const gamePlayersProgress = _.filter(gamePlayers, { progressGameMessageId: gameMessageId.toString() });

        return _.map(gamePlayersProgress, (gamePlayer) => (
          <div className="progressMarker" key={`progress-marker-${gamePlayer.id}`}>
            <Divider horizontal section>
              <Icon circular inverted name='check' />&nbsp;
              {
                gamePlayer.character
                  ? gamePlayer.character.name
                  : '(GM) ' + gamePlayer.user.name
              }
            </Divider>
          </div>
        ));
      }}
    </Consumer>
  );
}

const mapDispatchToProps = dispatch => ({
  quoteGameMessage: (message) => dispatch(quote(message))
});


const GameMessageContainer = compose(
  graphql(updateGameMessageMutation, {
    name: 'updateMessage'
  }),
  connect(null, mapDispatchToProps, null, { pure: false }),
)(GameMessage);
