import v1_0_0_PrimaryAttributes from './1.0.0/PrimaryAttributes.js';
import v1_0_0_SecondaryAttributes from './1.0.0/SecondaryAttributes.js';

const versions = {
  '1.0.0': {
    PrimaryAttributes: v1_0_0_PrimaryAttributes,
    SecondaryAttributes: v1_0_0_SecondaryAttributes
  }
};

export function primaryAttributes(version) {
  return versions[version].PrimaryAttributes;
}

export function secondaryAttributes(version) {
  return versions[version].SecondaryAttributes;
}
