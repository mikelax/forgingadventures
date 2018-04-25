import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import { Button } from 'semantic-ui-react';

import { createCharacterMutation } from '../queries';
import CharacterDetailsForm from '../components/CharacterDetailsForm';

import './CreateCharacter.styl';

class CreateCharacter extends Component {

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Create new Character on Forging Adventures</title>
        </Helmet>

        <div className="create-character">
          <h1>Create a New Character</h1>

          <CharacterDetailsForm ref={this._formRef} />

          <div className="actions">
            <Button primary onClick={this._submit}>Submit</Button>
            <Button onClick={this._onCancel}>Cancel</Button>
          </div>
        </div>
      </React.Fragment>
    );
  };

  _submit = () => {
    this.form.submitForm();
  };

  _formRef = (ref) => {
    this.form = ref;
  };

  _onCancel = () => {
    this.props.history.push('/profile');
  };

  _onSave = (payload) => {
    if (this.form.valid()) {
      const { createCharacter } = this.props;

      return createCharacter({
        variables: {
          input: payload
        }
      })
        .then(() => this.props.history.replace('/profile'));
    }
  };
}

export default compose(
  graphql(createCharacterMutation, { name: 'createCharacter' })
)(CreateCharacter);
