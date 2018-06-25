import DandD from './1_5e';
import PatherFinder from './2_pathFinder';

import dnDValidationGameMessageMetaValidation from './1_5e/validationMessageMeta';
import pathFinderGameMessageMetaValidation from './2_pathFinder/validationMessageMeta';

const LabelEngines = {
  1: DandD,
  2: PatherFinder
};

const labelGameMessageValidation = {
  1: dnDValidationGameMessageMetaValidation,
  2: pathFinderGameMessageMetaValidation
};

export default function engineLoader({ labelId, version }) {
  return new LabelEngines[labelId]({ version });
}

export function gameMessageMetaValidation({ labelId, meta }) {
  return labelGameMessageValidation[labelId].validate(meta, {
    strict: true,
    stripUnknown: true
  });
}
