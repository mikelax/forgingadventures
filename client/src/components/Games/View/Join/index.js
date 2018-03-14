import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { Button, Form, Header } from 'semantic-ui-react';
import { compose } from 'recompose';

import RichEditor from '../../../shared/components/RichEditor';
import { gameQuery, createGamePlayerMutation, createGameLoungeMessageMutation } from '../../queries';
import CharactersSelect from '../../../Characters/components/CharactersSelect';

const JoinGame = class JoinGame extends Component {

  state = {
    store: {
      characterId: 0,
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

            <Form.Field>
              <label>Character</label>
              <CharactersSelect
                error={this._validity('characterId')}
                value={this._formValue('characterId')}
                onChange={this._formInput('characterId')}
              />
            </Form.Field>


            <div>
              <Button primary onClick={this._submit} 
              disabled={saving || !(hasContent)} 
              loading={saving}>
                Submit
              </Button>
              <Button onClick={this._cancel}>Cancel</Button>
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

  _cancel = () => {
    const { match: { params: { id } } } = this.props;

    this.props.history.push(`/games/${id}`);
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
            characterId: this._formValue('characterId') !== 0 ? this._formValue('characterId') : null,
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
        .then(() => this.setState({ saving: false }))
        .then(() => history.replace(`/games/${id}`));
        
    }
  };

  _valid = () => {
    return true;
  };

  _validity = (field) => {
    return this.state.errors[field] === true;
  };

  _formInput = (stateKey) => {
    return (e) => {
      const { store } = this.state;

      _.set(store, stateKey, e.target.value);
      this.setState({ ...this.state, store });
    };
  };

  _formValue = (stateKey) => {
    return _.get(this.state.store, stateKey, '');
  };
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
