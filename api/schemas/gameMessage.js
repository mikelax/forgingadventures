import { makeExecutableSchema } from 'graphql-tools';
import { withFilter } from 'graphql-subscriptions';
import GraphQLJSON from 'graphql-type-json';

import GameMessage from 'models/gameMessage';
import schemaScopeGate from 'services/schemaScopeGate';

import getUser from 'services/user';
import pubsub from 'services/pubsub';

export const TOPIC_MESSAGE_ADDED = 'messageAdded';

const typeDefs = `

  scalar JSON
  
  type GameMessage {
    id: ID!,
    gameId: ID!,
    message: JSON!
  }
  
  # queries
  type Query {
    message(id: ID!): GameMessage!,
    gameMessages(gameId: ID!): [GameMessage!]
  }
  
  # mutations
  type Mutation {
    createGameMessage(input: CreateGameMessageInput): GameMessage,
    updateGameMessage(id: ID!, input: UpdateGameMessageInput): GameMessage
  }
  
  input CreateGameMessageInput {
    gameId: ID!,
    message: JSON!
  }
  
  input UpdateGameMessageInput {
    message: JSON!
  }
  
  # subscriptions
  type Subscription {
    messageAdded(gameId: ID!): GameMessage!
  }
`;

const resolvers = {
  Query: {
    message: (obj, { id }, context) =>
      schemaScopeGate(['create:posts'], context, () =>
        GameMessage.query().findById(id)),

    gameMessages: (obj, { gameId }, context) =>
      schemaScopeGate(['create:posts'], context, () =>
        GameMessage.query().where({ gameId }))
  },
  Mutation: {
    createGameMessage: (obj, { input }, context) =>
      schemaScopeGate(['create:posts'], context, () => {
        return getUser(context.req.user.sub)
          .then((user) => {
            input.userId = user.id;

            return GameMessage
              .query()
              .insert(input)
              .returning('*')
              .then((gameMessage) => {
                pubsub.publish(TOPIC_MESSAGE_ADDED, {
                  messageAdded: gameMessage
                });

                return gameMessage;
              });
          });
      }),
    updateGameMessage: (obj, { id, input }, context) =>
      schemaScopeGate(['create:posts'], context, () => {
        return GameMessage
          .query()
          .patch({ message: input.message })
          .where('id', id)
          .first()
          .returning('*');
      })
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator(TOPIC_MESSAGE_ADDED), (payload, variables) => {
        return payload.messageAdded.gameId === Number(variables.gameId);
      })
    }
  },
  JSON: GraphQLJSON
};

export default makeExecutableSchema({ typeDefs, resolvers });
