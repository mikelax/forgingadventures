import { mergeSchemas } from 'graphql-tools';

import game from 'schemas/game';
import gameMessage from 'schemas/gameMessage';

export default mergeSchemas({
  schemas: [gameMessage, game],
});
