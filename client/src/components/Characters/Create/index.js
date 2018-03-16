import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';

import { createCharacterMutation } from '../queries';
import CharacterDetailsForm from '../components/CharacterDetailsForm';

class CreateCharacter extends Component {

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Create new Character on Forging Adventures</title>
        </Helmet>

        <div className="CreateCharacter">
          <h1>Create a New Character</h1>

          <CharacterDetailsForm onSave={this._onSave} onCancel={this._onCancel} />
        </div>
      </React.Fragment>
    );
  };

  _onCancel = () => {
    this.props.history.push('/profile');
  };

  _onSave = (payload) => {
    const { createCharacter } = this.props;

    return createCharacter({
        variables: {
          input: payload
        }
      })
      .then(() => this.props.history.replace('/profile'));
  };
};

export default compose(
  graphql(createCharacterMutation, { name: 'createCharacter' })
)(CreateCharacter);
