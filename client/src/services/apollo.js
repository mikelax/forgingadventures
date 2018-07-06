import _ from 'lodash';

export function stripStoreVars(input) {
  return _.omit(input, [ '__typename' ]);
}
