import { withFilter } from 'graphql-subscriptions';

import GameLounge from 'models/gameLounge';
import User from 'models/user';

import schemaScopeGate from 'services/schemaScopeGate';

import { getOrCreateUserByAuth0Id } from 'services/user';
import pubsub from 'services/pubsub';

export const LOUNGE_MESSAGE_ADDED = 'lounge_message_added';

export const gameLoungeTypeDefs = `

  type GameLoungeMessage {
    id: ID!,
    user: User!,
    gameId: ID!,
    message: JSON!,
    created_at: GraphQLDateTime
  }
  
  input CreateGameLoungeMessageInput {
    gameId: ID!,
    message: JSON!
  }
`;

export const gameLoungeResolvers = {
  GameLoungeMessage: {
    user: gameLoungeMessage => User.query().findById(gameLoungeMessage.userId)
  },
  Query: {
    gameLoungeMessage: (obj, { id }) => GameLounge.query().findById(id),
    gameLoungeMessages: (obj, { gameId }) => GameLounge.query().where({ gameId })
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
      })
  },
  Subscription: {
    gameLoungeMessageAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator(LOUNGE_MESSAGE_ADDED), (payload, variables) => {
        const { gameLoungeMessageAdded } = payload;
        const { gameId } = variables;

        return gameLoungeMessageAdded.gameId === Number(gameId);
      })
    }
  }
};
