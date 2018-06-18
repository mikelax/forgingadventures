import _ from 'lodash';
import React from 'react';
import { Loader } from 'semantic-ui-react';

export default function InlineLoader(props) {
  const { items, loading, children } = props;
  const hasItems = !(_.isEmpty(items));

  if (hasItems) {
    return children;
  } else if (loading) {
    return <Loader active={true} />;
  } else {
    return null;
  }


}
