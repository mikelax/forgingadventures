import _ from 'lodash';
import React from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import { Button, Segment } from 'semantic-ui-react';

import { characterQuery, updateCharacterMutation } from '../queries';
import CharacterDetailsForm from '../components/CharacterDetailsForm';
import OwnerGuard from '../../shared/OwnerGuard';

import './EditCharacter.styl';

class EditCharacter extends React.Component {
  render() {
    const character = _.get(this.props, 'data.character');
    const name = _.get(this.props, 'data.character.name');
    const loading = _.get(this.props, 'data.loading');

    return (
      <React.Fragment>
        <Helmet>
          <title>{`Editing Character ${name}`}</title>
        </Helmet>

        <div className="edit-character">
          <h1>Edit Character</h1>

          <CharacterDetailsForm
            onSubmit={this._onSave}
            character={character}
            loading={loading}
            lockLabel={true}
            renderActions={({ errors, submitCount, submitForm }) => (
              <Segment>
                {(!_.isEmpty(errors)) && (
                  <Segment inverted color='orange' tertiary>
                    Please review form for highlighted errors
                  </Segment>
                )}

                <Button primary onClick={submitForm}>Submit</Button>
                <Button onClick={this._onCancel}>Cancel</Button>
              </Segment>
            )}
          />
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
  OwnerGuard('data.character.userId')
)(EditCharacter);
