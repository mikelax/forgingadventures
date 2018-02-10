import { withFilter } from 'graphql-subscriptions';
import { raw } from 'objection';

import GameLounge from 'models/gameLounge';
import User from 'models/user';

import schemaScopeGate from 'services/schemaScopeGate';

import { getOrCreateUserByAuth0Id } from 'services/user';
import pubsub from 'services/pubsub';

export const LOUNGE_MESSAGE_ADDED = 'lounge_message_added';
export const LOUNGE_MESSAGE_UPDATED = 'lounge_message_updated';

export const gameLoungeTypeDefs = `

  type GameLoungeMessage {
    id: ID!,
    user: User!,
    gameId: ID!,
    message: JSON!,
    numberEdits: Int!,
    meta: String,
    updated_at: GraphQLDateTime,
    created_at: GraphQLDateTime
  }
  
  input CreateGameLoungeMessageInput {
    gameId: ID!,
    message: JSON!,
    meta: String
  }
  
  input UpdateGameLoungeMessageInput {
    message: JSON!
  }
`;

export const gameLoungeResolvers = {
  GameLoungeMessage: {
    user: gameLoungeMessage => User.query().findById(gameLoungeMessage.userId)
  },
  Query: {
    gameLoungeMessage: (obj, { id }) => GameLounge.query().findById(id),
    gameLoungeMessages: (obj, { gameId }) => GameLounge.query().where({ gameId }).orderBy('created_at')
  },
  Mutation: {
    createGameLoungeMessage: (obj, { input }, context) =>
      schemaScopeGate(['create:posts'], context, () => {
        return getOrCreateUserByAuth0Id(context.req.user.sub)
          .then((user) => {
            input.userId = user.id;

            return GameLounge
              .query()
              .insert(input)
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
        return getOrCreateUserByAuth0Id(context.req.user.sub)
          .then((user) => {
            input.userId = user.id;

            return GameLounge
              .query()
              .patch({
                message: input.message,
                numberEdits: raw('"numberEdits" + 1')
              })
              .where('id', id)
              .first()
              .returning('*')
              .execute()
              .tap((gameMessage) => {
                pubsub.publish(LOUNGE_MESSAGE_UPDATED, {
                  gameLoungeMessageUpdated: gameMessage
                });
              });
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
