import { withFilter } from 'graphql-subscriptions';

import GamePlayer from 'models/gamePlayer';
import schemaScopeGate from 'services/schemaScopeGate';
import { getOrCreateUserByAuth0Id } from 'services/user';
import pubsub from 'services/pubsub';

export const GAME_PLAYER_ADDED = 'game_player_added';
export const GAME_PLAYER_UPDATED = 'game_player_updated';

export const gamePlayerTypeDefs = `

  type GamePlayer {
    id: ID!,
    user: User!,
    gameId: ID!,
    status: String!,
    updated_at: GraphQLDateTime,
    created_at: GraphQLDateTime
  }
  
  input CreateGamePlayerInput {
    gameId: ID!,
    status: String!
  }
  
  input UpdateGamePlayerInput {
    status: String!
  }
`;

export const gamePlayerResolvers = {
  GamePlayer: {
    user: gameLoungeMessage => User.query().findById(gameLoungeMessage.userId)
  },
  Query: {
    gamePlayer: (obj, { id }) => GamePlayer.query().findById(id),
    gamePlayers: (obj, { gameId }) => GamePlayer.query().where({ gameId }).orderBy('created_at')
  },
  Mutation: {
    createGamePlayer: (obj, { input }, context) =>
      schemaScopeGate(['create:games'], context, () => {
        return getOrCreateUserByAuth0Id(context.req.user.sub)
          .then((user) => {
            input.userId = user.id;

            return GamePlayer
              .query()
              .insert(input)
              .returning('*')
              .execute()
              .tap((gamePlayerMessage) => {
                pubsub.publish(GAME_PLAYER_ADDED, {
                  gamePlayerAdded: gamePlayerMessage
                });
              });
          });
      }),
    updateGamePlayer: (obj, { id, input }, context) =>
      schemaScopeGate(['create:posts'], context, () => {
        return getOrCreateUserByAuth0Id(context.req.user.sub)
          .then((user) => {
            input.userId = user.id;

            return GamePlayer
              .query()
              .patch({
                status: input.status
              })
              .where('id', id)
              .first()
              .returning('*')
              .execute()
              .tap((gamePlayerMessage) => {
                pubsub.publish(GAME_PLAYER_UPDATED, {
                  gamePlayerUpdated: gamePlayerMessage
                });
              });
          });
      })
  },
  Subscription: {
    gamePlayerAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator(GAME_PLAYER_ADDED), (payload, variables) => {
        const { gamePlayerAdded } = payload;
        const { gameId } = variables;

        return gamePlayerAdded.gameId === Number(gameId);
      })
    },
    gamePlayerUpdated: {
      subscribe: withFilter(() => pubsub.asyncIterator(GAME_PLAYER_UPDATED), (payload, variables) => {
        const { gamePlayerUpdated } = payload;
        const { gameId } = variables;

        return gamePlayerUpdated.gameId === Number(gameId);
      })
    }
  }
};
