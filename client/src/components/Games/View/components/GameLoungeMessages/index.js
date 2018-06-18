import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Button, Header, Icon, Grid, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';

import InlineItemsLoader from 'components/shared/InlineItemsLoader';
import RichEditor from 'components/shared/RichEditor';
import { UserImageAvatar } from 'components/shared/ProfileImageAvatar';
import { quote } from 'actions/loungeMessage';

import {
  gameLoungeMessagesQuery,
  updateGameLoungeMessageMutation,
  onGameLoungeMessageAdded,
  onGameLoungeMessageUpdated
} from '../../../queries';
import { meQuery } from 'queries/users';

import ApolloLoader from 'components/shared/ApolloLoader';

import './gameLoungeMessages.styl';

class GameLoungeMessages extends Component {

  componentWillMount() {
    this._setupSubscriptions();
  }

  render() {
    const { data: { gameLoungeMessages }, loading } = this.props;

    return (
      <InlineItemsLoader items={gameLoungeMessages} loading={loading}>
        <Segment>
          <div className="game-lounge-messages">
            <Header as="h2">Lounge Messages</Header>

            {_.map(gameLoungeMessages, (loungeMessage) => (
              <Segment key={`lounge-message-${loungeMessage.id}`} className='game-lounge-message'>
                <GameLoungeMessageContainerData key={loungeMessage.id} loungeMessage={loungeMessage} />
              </Segment>
            ))}
          </div>
        </Segment>
      </InlineItemsLoader>
    );

  }

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
      <Grid divided='vertically'>
        <Grid.Row columns={2} className="message-header">
          <Grid.Column computer={2} tablet={3} mobile={4}
                       textAlign="center" verticalAlign="middle">
            <UserImageAvatar user={user}/>
          </Grid.Column>
          <Grid.Column computer={14} tablet={13} mobile={12}
                       className="user-name" verticalAlign="middle">
            {user.name}
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column className="column-message">
            <RichEditor message={loungeMessage.message} ref={this.editor} readOnly={!(editing)} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2} className="slim" verticalAlign="middle">
          <Grid.Column>
            {this._messageControls(user.id)}
          </Grid.Column>

          <Grid.Column textAlign="right" className="column-info">
            Posted {this._relativeDate(loungeMessage.created_at)}
            {this._lastEdited()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
          <div className="meta"><Icon name="user plus" color="green" />{user.name} has joined the game!</div>
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
          {canEdit && <Button size="tiny" compact={true} onClick={this._handleEdit}>Edit</Button>}
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
          <div className="last-edited">Updated {this._relativeDate(loungeMessage.updated_at)}</div>
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
