import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Button, Header, Grid, Segment, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';

import RichEditor from 'components/shared/RichEditor';
import { UserImageAvatar } from 'components/shared/ProfileImageAvatar';
import UberPaginator from 'components/shared/UberPaginator';
import { quote } from 'actions/loungeMessage';

import {
  gameLoungeMessagesQuery,
  updateGameLoungeMessageMutation,
  onGameLoungeMessageAdded,
  onGameLoungeMessageUpdated,
  gameLoungeMessagesSummaryQuery
} from 'components/Games/queries';

import { meQuery } from 'queries/users';

import './gameLoungeMessages.styl';

export default function GameLoungeMessages(props) {
  const { gameId } = props;

  const summaryQuery = {
    query: gameLoungeMessagesSummaryQuery,
    variables: { gameId },
    dataKey: 'gameLoungeMessagesSummary.countMessages'
  };
  const itemsQuery = {
    query: gameLoungeMessagesQuery,
    variables: { gameId },
    dataKey: 'gameLoungeMessages'
  };

  return (
    <UberPaginator
      summaryQuery={summaryQuery}
      itemsQuery={itemsQuery}
    >
      {({ items, loading, subscribeToMore }) => (
        <Segment loading={loading}>
          <div className='game-lounge-messages'>
            <Header as="h1">Lounge Messages</Header>

            {_.isEmpty(items) && (
              <Message positive>
                <Message.Header>No Game Lounge messages yet</Message.Header>
                <p>
                  Be the first to post
                </p>
              </Message>
            )}

            <LoungeMessagesRenderer
              gameLoungeMessages={items}
              subscribeToMore={subscribeToMore}
              gameId={gameId}
            />
          </div>
        </Segment>
      )}
    </UberPaginator>
  );
}

GameLoungeMessages.propTypes = {
  gameId: PropTypes.string.isRequired
};

// private

class LoungeMessagesRenderer extends Component {

  componentDidMount() {
    this._setupSubscriptions();
  }

  render() {
    const { gameLoungeMessages } = this.props;

    return _.map(gameLoungeMessages, (loungeMessage) => (
      <Segment key={`lounge-message-${loungeMessage.id}`} className='game-lounge-message'>
        <GameLoungeMessageContainerData key={loungeMessage.id} loungeMessage={loungeMessage} />
      </Segment>
    ));
  }

  _setupSubscriptions() {
    const { gameId, subscribeToMore } = this.props;

    subscribeToMore({
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

    subscribeToMore({
      document: onGameLoungeMessageUpdated,
      variables: {
        gameId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const { gameLoungeMessageUpdated } = subscriptionData.data;
        const oldMessageIndex = _.findIndex(prev.gameLoungeMessages, { id: gameLoungeMessageUpdated.id });

        return _.map(prev.gameLoungeMessages, (gameLoungeMessage, index) => {
          if (index !== oldMessageIndex) {
            return gameLoungeMessage;
          } else {
            return {
              ...prev.gameLoungeMessages[oldMessageIndex],
              ...gameLoungeMessageUpdated
            };
          }
        });
      }
    });
  }

}

class GameLoungeMessageContainer extends Component {

  state = {
    editing: false
  };

  editor = React.createRef();

  render() {
    const { loungeMessage, loungeMessage: { meta, user } } = this.props;
    const displayMessageContent = !(meta) || (meta === 'join');
    const { editing } = this.state;

    return (
      <Grid divided='vertically'>
        <Grid.Row columns={2} className="message-header">
          <Grid.Column computer={2} tablet={3} mobile={4}
                       textAlign="center" verticalAlign="middle">
            <UserImageAvatar user={user} size="tiny" />
          </Grid.Column>
          <Grid.Column computer={14} tablet={13} mobile={12}
                       className="user-name" verticalAlign="middle">
            {user.name}
          </Grid.Column>
        </Grid.Row>

        <MetaRow loungeMessage={loungeMessage} />

        { displayMessageContent && (
          <Grid.Row>
            <Grid.Column className="column-message">
              <RichEditor message={loungeMessage.message} ref={this.editor} readOnly={!(editing)} />
            </Grid.Column>
          </Grid.Row>
        ) }

        <Grid.Row columns={2} className="slim" verticalAlign="middle">
          <Grid.Column>
            {displayMessageContent && this._messageControls()}
          </Grid.Column>

          <Grid.Column textAlign="right" className="column-info">
            Posted {this._relativeDate(loungeMessage.createdAt)}
            {this._lastEdited()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  ////// private

  _messageControls = () => {
    const { editing } = this.state;

    return editing ? this._editingControls() : this._viewingControls();
  };

  _viewingControls = () => {
    const { loungeMessage: { meta, user: { id: messageUserId } }, meQuery } = this.props;

    const canEdit = _.eq(messageUserId, _.get(meQuery, 'me.id'));
    const canPost = _.get(this.props, ('meQuery.me.id'));

    if (canPost) {
      return (
        <React.Fragment>
          {canEdit && !(meta) && <Button size="tiny" compact={true} onClick={this._handleEdit}>Edit</Button>}
          <Button size="tiny" compact={true} onClick={this._handleQuote}>Quote</Button>
        </React.Fragment>
      );
    }
  };

  _editingControls = () => (
    <React.Fragment>
      <Button size="tiny" compact={true} onClick={this._handleSubmit}>Update</Button>
      <Button size="tiny" compact={true} onClick={this._handleCancel}>Cancel</Button>
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

  _lastEdited = () => {
    const { loungeMessage } = this.props;

    if (loungeMessage.numberEdits) {
      return (
        <div className="edited">
          <div className="last-edited">Updated {this._relativeDate(loungeMessage.updatedAt)}</div>
          <div className="number-edits">Edits: {loungeMessage.numberEdits}</div>
        </div>
      );
    } else {
      return null;
    }
  };

  _relativeDate = (date) => {
    const dateObject = moment(date);
    const dateDisplayRelative = dateObject.subtract(20, 's').fromNow(); // addresses clock skew on DB
    const dateDisplayActual = dateObject.format('LLL');

    return <span className="date" title={dateDisplayActual}>{dateDisplayRelative}</span>;
  };
}

function MetaRow(props) {
  const { loungeMessage: { user, message, meta } }  = props;

  return meta && (
    <Grid.Row className="slim">
      <Grid.Column className="column-meta">
        <MetaMessage meta={meta} />
      </Grid.Column>
    </Grid.Row>
  );

  function MetaMessage(props) {
    const { meta } = props;
    const color = {
      join: 'teal',
      accepted: 'green',
      quit: 'orange'
    }[meta];

    const status = {
      join: 'applied to join',
      quit: 'has quit'
    }[meta];

    const showMessage = meta === 'accepted'
      ? message
      : `${user.name} ${status} the game.`;

    return <Message color={color} size="mini">{showMessage}</Message>;
  }

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
