import _ from 'lodash';
import React from 'react';
import { Card, Tab } from 'semantic-ui-react';

import GameCard from 'components/Games/components/GameCard';

export default function(props) {
  const { myGames, loading } = props;

  return (
    <Tab.Pane loading={loading}>
      <Card.Group stackable={true} itemsPerRow={3}>
        {_.map(myGames, (game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </Card.Group>
    </Tab.Pane>
  );
}
