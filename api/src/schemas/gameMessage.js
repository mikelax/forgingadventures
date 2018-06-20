import _ from 'lodash';
import { withFilter } from 'graphql-subscriptions';
import { raw } from 'objection';

import GameMessage from 'models/gameMessage';

import schemaScopeGate from 'services/schemaScopeGate';
import CreateGameMessage from 'services/gameMessages/createGameMessage';
import { getUser } from 'services/user';
import pubsub from 'services/pubsub';

import serviceExecutor from 'utils/serviceExecutor';

export const TOPIC_MESSAGE_ADDED = 'topic_message_added';
export const TOPIC_MESSAGE_UPDATED = 'topic_message_updated';

export const gameMessageTypeDefs = `

  extend type Query {
    gameMessage(id: ID!): GameMessage!
    gameMessages(gameId: ID!): [GameMessage!]
  }

  extend type Mutation {
    createGameMessage(input: CreateGameMessageInput): GameMessage
    updateGameMessage(id: ID!, input: UpdateGameMessageInput): GameMessage
  }

  extend type Subscription {
    messageAdded(gameId: ID!): GameMessage!
    messageUpdated(gameId: ID!): GameMessage!
  }

  type GameMessage {
    id: ID!,
    gameId: ID!,
    game: Game!,
    user: User!,
    character: Character,
    message: String!,
    numberEdits: Int!,
    postType: String!,
    meta: JSON,
    updatedAt: GraphQLDateTime,
    createdAt: GraphQLDateTime
  }

  input CreateGameMessageInput {
    gameId: ID!,
    characterId: ID,
    postType: String!,
    message: String!,
    meta: JSON
  }

  input UpdateGameMessageInput {
    message: String!
  }
`;

export const gameMessageResolvers = {
  GameMessage: {
    character: (gameMessage, vars, context) => gameMessage.characterId &&
      context.loaders.characters.load(gameMessage.characterId),
    game: (gameMessage, vars, context) => context.loaders.games.load(gameMessage.gameId),
    user: (gameMessage, vars, context) => context.loaders.users.load(gameMessage.userId)
  },
  Query: {
    gameMessage: (obj, { id }) =>
      GameMessage.query().findById(id),

    gameMessages: (obj, { gameId }) =>
      GameMessage.query().where({ gameId }).orderBy('createdAt')
  },
  Mutation: {
    createGameMessage: (obj, { input }, context) =>
      schemaScopeGate(['create:posts'], context, () => {
        return getUser(context.req.user.sub)
          .then((user) => {
            return serviceExecutor(CreateGameMessage, {
              user,
              input
            })
              .tap(messageAdded => pubsub.publish(TOPIC_MESSAGE_ADDED, { messageAdded }));
          });
      }),

    updateGameMessage: (obj, { id, input }, context) =>
      schemaScopeGate(['create:posts'], context, () => {
        return getUser(context.req.user.sub)
          .then((user) => {
            return GameMessage
              .query()
              .count('*')
              .where('id', id)
              .where('userId', user.id) // May refactor to consider allowing admin or GM to edit
              .first()
              .execute();
          })
          .then((rowCount) => {
            // In PG count returns as String from knex
            if (_.eq(rowCount.count, '1')) {
              return GameMessage
                .query()
                .patch({
                  message: input.message,
                  numberEdits: raw('"number_edits" + 1')
                })
                .where('id', id)
                .first()
                .returning('*')
                .execute()
                .tap((gameMessage) => {
                  pubsub.publish(TOPIC_MESSAGE_UPDATED, {
                    messageUpdated: gameMessage
                  });
                });
            }
          });
      })
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator(TOPIC_MESSAGE_ADDED), (payload, variables) => {
        return payload.messageAdded.gameId === Number(variables.gameId);
      })
    },

    messageUpdated: {
      subscribe: withFilter(() => pubsub.asyncIterator(TOPIC_MESSAGE_UPDATED), (payload, variables) => {
        return payload.messageUpdated.gameId === Number(variables.gameId);
      })
    }
  }
};
