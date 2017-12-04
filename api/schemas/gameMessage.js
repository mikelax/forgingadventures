import { makeExecutableSchema } from 'graphql-tools';

import GameMessage from 'models/gameMessage';
import schemaScopeGate from 'services/schemaScopeGate';

const typeDefs = `
  type GameMessage {
    id: ID!,
    gameId: ID!,
    message: String!
  }
  
  # queries
  type Query {
    message(id: ID!): GameMessage!,
    gameMessages(gameId: ID!): [GameMessage]
  }
  
  # mutations
  type Mutation {
    createGameMessage(input: CreateGameMessageInput): GameMessage
  }
  
  input CreateGameMessageInput {
    gameId: ID!,
    message: String!
  }
`;

const resolvers = {
  Query: {
    message: (obj, { id }, context) =>
      schemaScopeGate(['read:messages'], context, () =>
        GameMessage.query().findById(id)),

    gameMessages: (obj, { gameId }, context) =>
      schemaScopeGate(['read:messages'], context, () =>
        GameMessage.query().where({ gameId }))
  },
  Mutation: {
    createGameMessage: (obj, { input }, context) =>
      schemaScopeGate(['write:messages'], context, () =>
        GameMessage
          .query()
          .insert(input)
          .returning('*'))
  }
};

export default makeExecutableSchema({ typeDefs, resolvers });
