import { mergeSchemas } from 'graphql-tools';

import game from 'schemas/game';
import gameLabel from 'schemas/gameLabel';
import gameMessage from 'schemas/gameMessage';

export default mergeSchemas({
  schemas: [gameMessage, gameLabel, game]
});
