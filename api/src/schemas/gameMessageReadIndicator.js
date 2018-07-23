import { withFilter } from 'graphql-subscriptions';

import GameMessageReadIndicator from 'models/gameMessageReadIndicator';

import schemaScopeGate from 'services/schemaScopeGate';
import { getUser } from 'services/user';
import pubsub from 'services/pubsub';
import createOrUpdateReadIndicator from 'services/gameMessageReadIndicators/createOrUpdateReadIndicator';

export const TOPIC_GAME_MESSAGE_READ_INDICATOR_ADDED = 'topic_game_message_read_indicator_added';
export const TOPIC_GAME_MESSAGE_READ_INDICATOR_DELETED = 'topic_game_message_read_indicator_deleted';

export const gameMessageReadIndicatorTypeDefs = `

  extend type Query {
    gameMessageIndicatorsForGame(gameId: ID!): GameMessageIndicator!
  }

  extend type Mutation {
    createGameMessageIndicator(input: CreateGameMessageIndicatorInput): GameMessageIndicator
    deleteGameMessageIndicator(id: ID!): GameMessageIndicator
  }

  extend type Subscription {
    gameMessageReadIndicatorAdded(gameId: ID!): GameMessageIndicator!
    gameMessageReadIndicatorDeleted(gameId: ID!): GameMessageIndicator!
  }

  type GameMessageIndicator {
    id: ID!,
    gameId: ID!,
    userId: ID!,
    gameMessageId: ID!,
    updatedAt: GraphQLDateTime,
    createdAt: GraphQLDateTime
  }
  
  input CreateGameMessageIndicatorInput {
    gameId: ID!,
    gameMessageId: ID!
  }
`;

export const gameMessageReadIndicatorResolvers = {
  Query: {
    gameMessageIndicatorsForGame: (obj, { gameId }) =>
      GameMessageReadIndicator.query().where({ gameId })
  },
  Mutation: {
    createGameMessageIndicator: (obj, { input }, context) =>
      schemaScopeGate(['create:posts'], context, () => {
        const { gameId, gameMessageId } = input;

        return getUser(context.req.user.sub)
          .then((user) => {
            return createOrUpdateReadIndicator({
              user, gameId, gameMessageId
            })
              .tap(gameMessageReadIndicator =>
                pubsub.publish(TOPIC_GAME_MESSAGE_READ_INDICATOR_ADDED, { gameMessageReadIndicator })
              );
          });
      }),

    deleteGameMessageIndicator: (obj, { id }, context) =>
      schemaScopeGate(['create:posts'], context, () => {
        return getUser(context.req.user.sub)
          .then((user) => {
            return GameMessageReadIndicator.query()
              .where({
                id, userId: user.id
              })
              .del()
              .returning('*')
              .first()
              .tap(gameMessageReadIndicator =>
                pubsub.publish(TOPIC_GAME_MESSAGE_READ_INDICATOR_DELETED, { gameMessageReadIndicator })
              );
          });
      })
  },
  Subscription: {
    gameMessageReadIndicatorAdded: {
      subscribe: withFilter(() => pubsub
        .asyncIterator(TOPIC_GAME_MESSAGE_READ_INDICATOR_ADDED), (payload, variables) => {
        return payload.gameMessageReadIndicator.gameId === Number(variables.gameId);
      })
    },

    gameMessageReadIndicatorDeleted: {
      subscribe: withFilter(() => pubsub
        .asyncIterator(TOPIC_GAME_MESSAGE_READ_INDICATOR_DELETED), (payload, variables) => {
        return payload.gameMessageReadIndicator.gameId === Number(variables.gameId);
      })
    }
  }
};
