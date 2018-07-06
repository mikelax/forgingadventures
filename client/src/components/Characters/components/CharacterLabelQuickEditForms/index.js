import { CharacterQuickEditForm as DnD5eCharacterQuickEditForm } from './1_5e';
import { CharacterQuickEditForm as PFCharacterQuickEditForm } from './2_pathFinder';

const labels = {
  1: DnD5eCharacterQuickEditForm,
  2: PFCharacterQuickEditForm
};

export function CharacterQuickEditForm(label, version) {
  return labels[label](version);
}

