import { withFilter } from 'graphql-subscriptions';

import GamePlayer from 'models/gamePlayer';

import schemaScopeGate from 'services/schemaScopeGate';
import { getOrCreateUserByAuth0Id, runIfContextHasUser } from 'services/user';
import pubsub from 'services/pubsub';

export const GAME_PLAYER_ADDED = 'game_player_added';
export const GAME_PLAYER_UPDATED = 'game_player_updated';

export const gamePlayerTypeDefs = `

  extend type Query {
    gamePlayer(id: ID!): GamePlayer!,
    myGamePlayer(gameId: ID!): [GamePlayer]
    myGamePlayers: [GamePlayer]
    gamePlayers(gameId: ID!, status: [String]): [GamePlayer!]
  }

  extend type Mutation {
    createGamePlayer(input: CreateGamePlayerInput): GamePlayer
    updateGamePlayer(id: ID!, input: UpdateGamePlayerInput): GamePlayer
    setGameMessageProgress(gamePlayerId: ID!, gameMessageId: ID!): GamePlayer
  }

  extend type Subscription {
    gamePlayerAdded(gameId: ID!): GamePlayer!
    gamePlayerUpdated(gameId: ID!): GamePlayer!
  }

  type GamePlayer {
    id: ID!,
    userId: ID!,
    characterId: ID,
    progressGameMessageId: ID,
    user: User!,
    game: Game!,
    status: String!,
    character: Character,
    updatedAt: GraphQLDateTime,
    createdAt: GraphQLDateTime
  }

  input CreateGamePlayerInput {
    gameId: ID!,
    status: String!,
    characterId: Int
  }

  input UpdateGamePlayerInput {
    status: String,
    characterId: Int
  }
`;

export const gamePlayerResolvers = {
  GamePlayer: {
    character: (gamePlayer, vars, context) => gamePlayer.characterId &&
      context.loaders.characters.load(gamePlayer.characterId),
    user: (gamePlayer, vars, context) => context.loaders.users.load(gamePlayer.userId),
    game: (gamePlayer, vars, context) => context.loaders.games.load(gamePlayer.gameId)
  },
  Query: {
    gamePlayer: (obj, { id }) => GamePlayer.query().findById(id),
    gamePlayers: (obj, { gameId, status = ['pending', 'accepted'] }) => GamePlayer.query()
      .where({ gameId })
      .whereIn('status', status)
      .orderBy('createdAt'),
    myGamePlayer: (obj, { gameId }, context) => {
      return runIfContextHasUser(context, (user) => {
        return GamePlayer
          .query()
          .where({ gameId, userId: user.id });
      });
    },
    myGamePlayers: (obj, variables, context) => {
      return runIfContextHasUser(context, (user) => {
        return GamePlayer
          .query()
          .where({ userId: user.id });
      });
    }
  },
  Mutation: {
    createGamePlayer: (obj, { input }, context) =>
      schemaScopeGate(['create:games'], context, () => {
        return getOrCreateUserByAuth0Id(context.req.user.sub)
          .then((user) => {
            return GamePlayer
              .query()
              .insert({
                ...input,
                userId: user.id
              })
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
            return GamePlayer
              .query()
              .patch(input)
              .where({
                id,
                userId: user.id
              })
              .first()
              .returning('*')
              .execute()
              .tap((gamePlayerMessage) => {
                return pubsub.publish(GAME_PLAYER_UPDATED, {
                  gamePlayerUpdated: gamePlayerMessage
                });
              });
          });
      }),

    setGameMessageProgress: (obj, { gamePlayerId, gameMessageId }, context) =>
      schemaScopeGate(['create:posts'], context, () => {
        return getOrCreateUserByAuth0Id(context.req.user.sub)
          .then((user) => {
            return GamePlayer
              .query()
              .where({
                id: gamePlayerId,
                userId: user.id
              })
              .patch({
                progressGameMessageId: gameMessageId
              })
              .first()
              .returning('*')
              .execute()
              .tap((gamePlayerMessage) => {
                return pubsub.publish(GAME_PLAYER_UPDATED, {
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
