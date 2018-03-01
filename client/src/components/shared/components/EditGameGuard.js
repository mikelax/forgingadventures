import _ from 'lodash';
import React from 'react';
import { graphql } from 'react-apollo';
import { compose, pure, branch, renderComponent } from 'recompose';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { gameQuery } from '../../Games/queries';

export default function(ProtectedComponent) {
  return compose(
    connect(
      ({ me }) => ({ me })
    ),
    graphql(gameQuery, {
      options: ( { match: { params: { id } } } ) => ({ variables: { id } })
    }),
    pure,
    branch(
      props => {
        const userId = _.get(props, 'me.me.id');
        const gameOwnerId = _.get(props, 'data.game.user.id');

        // wait until all props are loaded
        if (_.isUndefined(userId) || _.isUndefined(gameOwnerId)) {
          return true;
        } else {
          return _.eq(userId, gameOwnerId);  
        }
      },
      renderComponent(ProtectedComponent),
      renderComponent(() => <Redirect to="/404"/>)
    ),
  )(ProtectedComponent);  
};
