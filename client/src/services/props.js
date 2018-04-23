import _ from 'lodash';

export function propsEqual(prevProps, curProps, propKey, valueKey) {
  const prevValue = _.get(prevProps, [propKey, valueKey]);
  const curValue = _.get(curProps, [propKey, valueKey]);

  return prevValue === curValue;
}

export function propsChanged(prevProps, curProps, propKey, valueKey) {
  return !(propsEqual(prevProps, curProps, propKey, valueKey));
}
