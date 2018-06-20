import _ from 'lodash';
import { withFilter } from 'graphql-subscriptions';
import { raw } from 'objection';

import GameLounge from 'models/gameLounge';

import pubsub from 'services/pubsub';
import schemaScopeGate from 'services/schemaScopeGate';
import { getUser } from 'services/user';

import sanitiseHtml from 'utils/sanitiseHtml';

export const LOUNGE_MESSAGE_ADDED = 'lounge_message_added';
export const LOUNGE_MESSAGE_UPDATED = 'lounge_message_updated';

export const gameLoungeTypeDefs = `

  extend type Query {
    gameLoungeMessage(id: ID!): GameLoungeMessage!
    gameLoungeMessages(gameId: ID!): [GameLoungeMessage!]
  }

  extend type Mutation {
    createGameLoungeMessage(input: CreateGameLoungeMessageInput): GameLoungeMessage
    updateGameLoungeMessage(id: ID!, input: UpdateGameLoungeMessageInput): GameLoungeMessage
  }

  extend type Subscription {
    gameLoungeMessageAdded(gameId: ID!): GameLoungeMessage!
    gameLoungeMessageUpdated(gameId: ID!): GameLoungeMessage!
  }

  type GameLoungeMessage {
    id: ID!,
    user: User!,
    gameId: ID!,
    message: String!,
    numberEdits: Int!,
    meta: String,
    updatedAt: GraphQLDateTime,
    createdAt: GraphQLDateTime
  }

  input CreateGameLoungeMessageInput {
    gameId: ID!,
    message: String!,
    meta: String
  }

  input UpdateGameLoungeMessageInput {
    message: String!
  }
`;

export const gameLoungeResolvers = {
  GameLoungeMessage: {
    user: (gameLoungeMessage, vars, context) => context.loaders.users.load(gameLoungeMessage.userId)
  },
  Query: {
    gameLoungeMessage: (obj, { id }) => GameLounge.query().findById(id),
    gameLoungeMessages: (obj, { gameId }) => GameLounge.query().where({ gameId }).orderBy('created_at')
  },
  Mutation: {
    createGameLoungeMessage: (obj, { input }, context) =>
      schemaScopeGate(['create:posts'], context, () => {
        return getUser(context.req.user.sub)
          .then((user) => {
            const payload = _.merge({}, input, {
              userId: user.id,
              message: sanitiseHtml(input.message)
            });

            return GameLounge
              .query()
              .insert(payload)
              .returning('*')
              .execute()
              .tap((loungeMessage) => {
                pubsub.publish(LOUNGE_MESSAGE_ADDED, {
                  gameLoungeMessageAdded: loungeMessage
                });
              });
          });
      }),
    updateGameLoungeMessage: (obj, { id, input }, context) =>
      schemaScopeGate(['create:posts'], context, () => {
        return getUser(context.req.user.sub)
          .then((user) => {
            return GameLounge
              .query()
              .where({
                id,
                userId: user.id
              })
              .first();
          })
          .then((gameLounge) => {
            if (gameLounge) {
              return GameLounge
                .query()
                .patch({
                  message: sanitiseHtml(input.message),
                  numberEdits: raw('"number_edits" + 1')
                })
                .where('id', gameLounge.id)
                .first()
                .returning('*')
                .execute()
                .tap((gameMessage) => {
                  pubsub.publish(LOUNGE_MESSAGE_UPDATED, {
                    gameLoungeMessageUpdated: gameMessage
                  });
                });
            }
          });
      })
  },
  Subscription: {
    gameLoungeMessageAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator(LOUNGE_MESSAGE_ADDED), (payload, variables) => {
        const { gameLoungeMessageAdded } = payload;
        const { gameId } = variables;

        return gameLoungeMessageAdded.gameId === Number(gameId);
      })
    },
    gameLoungeMessageUpdated: {
      subscribe: withFilter(() => pubsub.asyncIterator(LOUNGE_MESSAGE_UPDATED), (payload, variables) => {
        const { gameLoungeMessageUpdated } = payload;
        const { gameId } = variables;

        return gameLoungeMessageUpdated.gameId === Number(gameId);
      })
    }
  }
};
