import _ from 'lodash';
import React from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { Button, Form, Header } from 'semantic-ui-react';
import { compose } from 'recompose';

import RichEditor from 'components/shared/RichEditor';
import CharactersSelect from 'components/shared/CharactersSelect';

import { gameQuery, createGamePlayerMutation, createGameLoungeMessageMutation } from '../../queries';


const JoinGame = class JoinGame extends React.Component {

  state = {
    store: {
      characterId: '',
      message: ''
    },
    errors: {}
  };

  editor = React.createRef();

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
            <Form.Field required>
              <label>Introduce yourself</label>
              <RichEditor
                placeholder='Say something about yourself...'
                ref={this.editor}
                onChange={this._handleOnChange} />
            </Form.Field>

            <CharactersSelect
              name='characterId'
              value={this._formValue('characterId')}
              onChange={this._setCharacter}
            />


            <div>
              <Button primary onClick={this._submit}
                disabled={saving || !(hasContent)}
                loading={saving}>
                Join Game
              </Button>
              <Button onClick={this._cancel}>Cancel</Button>
            </div>
          </Form>

        </div>
      </React.Fragment>
    );
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

    const { store } = this.state;

    if (this._valid()) {
      this.setState({ saving: true });

      createGamePlayer({
        variables: {
          input: {
            characterId: store.characterId !== '' ? store.characterId : null,
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
                message: this.editor.current.getEditorMessage()
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

  _setCharacter = (character) => {
    const value = _.get(character, 'value', null);

    this.setState(prevState => {
      const { store } = prevState;
      _.set(store, 'characterId', value);

      return { store };
    });
  };

  _formInput = (stateKey) => {
    return (e) => {
      const value = e.target.value;

      this.setState(({ store }) => {
        _.set(store, stateKey, value);
        return { store };
      });
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
