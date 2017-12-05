import { makeExecutableSchema } from 'graphql-tools';
import { withFilter } from 'graphql-subscriptions';

import GameMessage from 'models/gameMessage';
import schemaScopeGate from 'services/schemaScopeGate';

import pubsub from 'services/pubsub';

export const TOPIC_MESSAGE_ADDED = 'messageAdded';

const typeDefs = `
  type GameMessage {
    id: ID!,
    gameId: ID!,
    message: String!
  }
  
  # queries
  type Query {
    message(id: ID!): GameMessage!,
    gameMessages(gameId: ID!): [GameMessage!]
  }
  
  # mutations
  type Mutation {
    createGameMessage(input: CreateGameMessageInput): GameMessage
  }
  
  input CreateGameMessageInput {
    gameId: ID!,
    message: String!
  }
  
  # subscriptions
  type Subscription {
    messageAdded(gameId: ID!): GameMessage!
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
          .returning('*')
          .then((gameMessage) => {
            pubsub.publish(TOPIC_MESSAGE_ADDED, {
              messageAdded: gameMessage
            });

            return gameMessage;
          })
      )
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator(TOPIC_MESSAGE_ADDED), (payload, variables) => {
        console.log('payload', payload)
        console.log('variables', variables)
        return payload.gameId === variables.gameId;
      })
    }
  }
};

export default makeExecutableSchema({ typeDefs, resolvers });
