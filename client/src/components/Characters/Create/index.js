import _ from 'lodash';
import React from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import { Button, Segment } from 'semantic-ui-react';

import { createCharacterMutation } from '../queries';
import CharacterDetailsForm from '../components/CharacterDetailsForm';

import './CreateCharacter.styl';

class CreateCharacter extends React.Component {

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Create new Character on Forging Adventures</title>
        </Helmet>

        <div className="create-character">
          <h1>Create a New Character</h1>

          <CharacterDetailsForm
            onSubmit={this._onSave}
            renderActions={({ errors, submitForm, submitCount, isSubmitting }) => (
              <Segment>
                { (!_.isEmpty(errors)) && (submitCount > 0) && (
                  <Segment inverted color='orange' tertiary>
                    Please review form for highlighted errors
                  </Segment>
                )}
                <Button primary onClick={submitForm} disabled={isSubmitting}>Submit</Button>
                <Button onClick={this._onCancel} disabled={isSubmitting}>Cancel</Button>
              </Segment>
            )}
          />
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
}

export default compose(
  graphql(createCharacterMutation, { name: 'createCharacter' })
)(CreateCharacter);
