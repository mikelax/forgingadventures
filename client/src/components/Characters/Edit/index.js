import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import { Header } from 'semantic-ui-react';

import { characterQuery, updateCharacterMutation } from '../queries';
import CharacterDetailsForm from '../components/CharacterDetailsForm';
import OwnerGuard from '../../shared/components/OwnerGuard';

class EditCharacter extends Component {
  render() {
    const character = _.get(this.props, 'data.character');
    const name = _.get(this.props, 'data.character.name');
    const loading = _.get(this.props, 'data.loading');

    return (
      <React.Fragment>
        <Helmet>
          <title>{`Editing Character ${name}`}</title>
        </Helmet>

        <div className="EditCharacter">
          <Header
            as='h1'
            content='Edit Character'
          />

          <CharacterDetailsForm onSave={this._onSave} character={character} loading={loading} onCancel={this._onCancel} />
        </div>
      </React.Fragment>
    );
  }

  _onCancel = () => {
    this.props.history.push('/profile');
  };

  _onSave = (payload) => {
    const { match: { params: { id } }, updateCharacter } = this.props;

    return updateCharacter({
        variables: {
          id: id,
          input: payload
        }
      })
      .then(() => this.props.history.replace('/profile'));
  };
}

export default compose(
  graphql(characterQuery, {
    options: ( { match: { params: { id } } } ) => ({ variables: { id } })
  }),
  graphql(updateCharacterMutation, { name: 'updateCharacter' }),
  OwnerGuard('data.game.user.id')
)(EditCharacter);
