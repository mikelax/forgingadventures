import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from "react-helmet";
import { Button, Form, Header } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import {gameQuery, createGamePlayerMutation, createGameLoungeMessageMutation} from '../../queries';
import {compose} from 'recompose';

const JoinGame = class JoinGame extends Component {

  state = {
    store: {
      message: ''
    },
    errors: {}
  };

  render() {
    if (this.state.saved) {
      const { match: { params: { id } } } = this.props;
      return <Redirect to={`/games/${id}`} />;
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Join the game on Forging Adventures</title>
        </Helmet>

        <div className="JoinGame">
          <Header as="h1">You're one step away from the Adventure</Header>

          <Form>
            <Form.Field>
              <label>Replace with Rich Editor</label>
              <Form.TextArea placeholder="placeholder here" />
            </Form.Field>

            <div>
              <Button primary onClick={this._submit}>Submit</Button>
            </div>
          </Form>

        </div>
      </React.Fragment>
    );
  };

  _submit = () => {
    const { match: { params: { id } } } = this.props;
    const { createGamePlayer } = this.props;

    if (this._valid()) {
      createGamePlayer(({
          variables: {
            input: {
              gameId: id,
              status: 'pending'
            }
          }
        })
      )
        .then(() => this.setState({ saved: true }));
    }
  };

  _valid = () => {
    return true;
  }
};

export default compose(
  graphql(gameQuery, {
    options: ( { match: { params: { id } } } ) => ({ variables: { id } })
  }),
  graphql(createGamePlayerMutation, {
    name: 'createGamePlayer'
  }),
  // todo - need to figure out how to create a draftJS message json packet before we can call this mutation
  graphql(createGameLoungeMessageMutation, {
    name: 'createGameLoungeMessage'
  }),
)(JoinGame);
