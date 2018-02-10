import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from "react-helmet";
import { Button, Form, Header } from 'semantic-ui-react';
import { compose } from 'recompose';

import RichEditor from '../../../shared/components/RichEditor';
import { gameQuery, createGamePlayerMutation, createGameLoungeMessageMutation } from '../../queries';

const JoinGame = class JoinGame extends Component {

  state = {
    store: {
      message: ''
    },
    errors: {}
  };

  render() {
    const { saving, hasContent } = this.state;

    return (
      <React.Fragment>
        <Helmet>
          <title>Join the game on Forging Adventures</title>
        </Helmet>

        <div className="JoinGame">
          <Header as="h1">You're one step away from the Adventure</Header>

          <Form>
            <Form.Field>
              <label>Introduce yourself</label>
              <RichEditor
                placeholder='Say something about yourself...'
                ref={this._getEditor}
                onChange={this._handleOnChange} />
            </Form.Field>


            <div>
              <Button primary onClick={this._submit} 
              disabled={saving || !(hasContent)} 
              loading={saving}>
                Submit
              </Button>
            </div>
          </Form>

        </div>
      </React.Fragment>
    );
  };

  _getEditor = (ref) => {
    this.editor = ref;
  };

  _handleOnChange = (data) => {
    this.setState({ hasContent: data.hasContent });
  };

  _submit = () => {
    const { match: { params: { id } } } = this.props;
    const { createGamePlayer } = this.props;
    const { createGameLoungeMessage } = this.props;
    const { history } = this.props;

    if (this._valid()) {
      this.setState({ saving: true });

      createGamePlayer({
        variables: {
          input: {
            gameId: id,
            status: 'pending'
          }
        }
      })
        .then(() => {
          return createGameLoungeMessage({
            variables: {
              input: {
                gameId: id,
                meta: 'join',
                message: this.editor.getEditorMessage()
              }
            }
          });
        })
        .then(() => history.replace(`/games/${id}`))
        .finally(() => this.setState({ saving: false }));
        
    }
  };

  _valid = () => {
    return true;
  }
};

export default compose(
  graphql(gameQuery, {
    options: ({ match: { params: { id } } }) => ({ variables: { id } })
  }),
  graphql(createGamePlayerMutation, {
    name: 'createGamePlayer'
  }),
  graphql(createGameLoungeMessageMutation, {
    name: 'createGameLoungeMessage'
  })
)(JoinGame);
