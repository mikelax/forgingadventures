import _ from 'lodash';

import Game from 'models/game';
import GamePlayer from 'models/gamePlayer';

import schemaScopeGate from 'services/schemaScopeGate';
import GetGames from 'services/games/getGames';
import { getUser } from 'services/user';

import serviceExecutor from 'utils/serviceExecutor';

export const gameTypeDefs = `
  type GameSetting {
    minPlayers: Int!,
    maxPlayers: Int!,
    skillLevel: Int!,
    postingFrequency: Int!,
    gameStatus: Int!
  }
  
  type Game {
    id: ID!,
    label: GameLabel!,
    title: String!,
    scenario: String!,
    overview: String!,
    gameSettings: GameSetting!,
    gameImage: ProfileImage,
    user: User!
  }
  
  input CreateGameInput {
    title: String!,
    scenario: String!,
    overview: String!,
    labelId: Int!,
    gameSettings: GameSettingInput!,
    gameImage: ProfileImageInput
  }

  input UpdateGameInput {
    title: String!,
    scenario: String!,
    overview: String!,
    labelId: Int!,
    gameSettings: GameSettingInput!,
    gameImage: ProfileImageInput
  }
  
  input GameSettingInput {
    minPlayers: Int!,
    maxPlayers: Int!,
    skillLevel: Int!,
    postingFrequency: Int!,
    gameStatus: Int!
  }
  
  input SearchOptions {
    textSearch: String,
    gameSettings: gameSettingsSearchOptions,
    labelId: Int
  }
  
  input gameSettingsSearchOptions {
    skillLevel: Int,
    postingFrequency: Int,
    gameStatus: Int
  }
`;

export const gameResolvers = {
  Game: {
    label: (game, vars, context) => context.loaders.gameLabels.load(game.labelId),
    user: (game, vars, context) => context.loaders.users.load(game.userId)
  },
  Query: {
    game: (parent, { id }) => Game.query().findById(id),
    games: (parent, { offset, searchOptions }) => serviceExecutor(GetGames, { offset, searchOptions })
  },
  Mutation: {
    createGame: (obj, { input }, context) =>
      schemaScopeGate(['create:games'], context, () => {
        // TODO consider writing function to automaticaly add userId to input
        return getUser(context.req.user.sub)
          .then((user) => {
            return Game
              .query()
              .insert(_.merge({}, {
                userId: user.id,
                gameSettings: {
                  gameStatus: 1
                }
              }, input))
              .returning('*');
          })
          .tap((gameResponse) => {
            const playerInput = {
              gameId: gameResponse.id,
              userId: gameResponse.userId,
              status: 'game-master'
            };

            return GamePlayer
              .query()
              .insert(playerInput);
          });
      }),
    updateGame: (obj, { id, input }, context) =>
      schemaScopeGate(['create:games'], context, () => {
        return Game
          .query()
          .update(input)
          .where('id', id)
          .returning('*')
          .first();
      })
  }
};
