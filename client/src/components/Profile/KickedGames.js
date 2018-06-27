import React from 'react';
import { Query } from 'react-apollo';

import GamesByStatus from './components/GamesByStatus';

import { myGamesQuery } from '../Games/queries';

export default function() {
  return (
    <Query
      query={myGamesQuery}
      variables={{ status: ['kicked'] }}
    >
      {({ data, loading }) => (
        <GamesByStatus myGames={data.myGames} loading={loading} />
      )}
    </Query>
  );
}

