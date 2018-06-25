import * as v1_0_0_validations from './1.0.0/validationCharacterDetails';

const versions = {
  '1.0.0': v1_0_0_validations
};

export default class {
  constructor({ version }) {
    this.validationCharacterDetails = versions[version];
  }

  validateCharacterDetails(input) {
    return this.validationCharacterDetails.validate(input, {
      strict: true,
      stripUnknown: true
    });
  }

}
