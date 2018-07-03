import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';

import { CharacterQuickEditForm } from 'components/Characters/components/CharacterLabelQuickEditForms';
import { characterQuery, quickUpdateCharacterMutation } from 'components/Characters/queries';

import './quickEditCharacterModal.styl';

export default function QuickEditCharacterModal(props) {
  const { character, characterDetails, open, gameId, onClose, onCancel } = props;
  const { labelId } = character;
  const { meta: { version } } = characterDetails;

  const QuickEditForm = CharacterQuickEditForm(labelId, version);

  return (
    <Query
      query={characterQuery}
      variables={{ id: character.id }}
    >
      {({ data, loading }) => (
        <Mutation
          mutation={quickUpdateCharacterMutation}
        >
          {quickUpdateCharacter => (
            <QuickEditForm
              open={open}
              data={data}
              loading={loading}
              gameId={gameId}
              onSave={handleSave(quickUpdateCharacter, character)}
              onCancel={handleClose}
            />
          )}
        </Mutation>
      )}
    </Query>
  );

  function handleClose() {
    onCancel();
  }

  function handleSave(quickUpdateCharacter, character) {
    return (payload) => {
      return quickUpdateCharacter({
        variables: {
          id: character.id,
          input: payload
        }
      })
        .then(() => onClose());
    };
  }

}

QuickEditCharacterModal.propTypes = {
  character: PropTypes.object.isRequired,
  characterDetails: PropTypes.object.isRequired,
  gameId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};
