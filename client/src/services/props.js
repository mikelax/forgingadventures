import _ from 'lodash';

export function propsEqual(prevProps, curProps, propKey, valueKey) {
  const path = keysToPath(propKey, valueKey);
  const prevValue = _.get(prevProps, path);
  const curValue = _.get(curProps, path);

  return prevValue === curValue;
}

export function propsChanged(prevProps, curProps, propKey, valueKey) {
  return !(propsEqual(prevProps, curProps, propKey, valueKey));
}

export function propsBase(prop, propKey, valueRoot, valueKey) {
  const path = keysToPath(propKey, valueRoot, valueKey);
  return _.get(prop, path);
}

function keysToPath(propKey, ...valueKeys) {
  const valueKey = _.join(valueKeys, '.');

  return _([]).concat(propKey, _.split(valueKey, '.')).flatten().value();
}
