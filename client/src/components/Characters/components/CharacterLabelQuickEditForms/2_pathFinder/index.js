import CharacterLabelQuickEditForm from './1.0.0/CharacterLabelQuickEditForm.js';

const versions = {
  '1.0.0': {
    CharacterLabelQuickEditForm
  }
};

export function CharacterQuickEditForm(version) {
  return versions[version].CharacterLabelQuickEditForm;
}
