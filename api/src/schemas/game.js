import _ from 'lodash';

import Game from 'models/game';
import GamePlayer from 'models/gamePlayer';

import schemaScopeGate from 'services/schemaScopeGate';
import GetGames from 'services/games/getGames';
import { getUser, runIfContextHasUser } from 'services/user';

import sanitiseHtml from 'utils/sanitiseHtml';
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
    labelId: ID!,
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
    postingFrequency: Int!
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
    games: (parent, { offset, searchOptions }) => serviceExecutor(GetGames, { offset, searchOptions }),
    myGames: (obj, { status = ['game-master', 'accepted'] }, context) => {
      return runIfContextHasUser(context, (user) => {
        return Game
          .query()
          .select('games.*')
          .join('game_players as gp', 'games.id', 'gp.gameId')
          .whereIn('gp.status', status)
          .where('gp.userId', user.id);
      });
    }
  },
  Mutation: {
    createGame: (obj, { input }, context) =>
      schemaScopeGate(['create:games'], context, () => {
        // TODO consider writing function to automaticaly add userId to input
        return getUser(context.req.user.sub)
          .then((user) => {
            return Game
              .query()
              .insert(_.merge({}, input, {
                userId: user.id,
                gameSettings: {
                  gameStatus: 1
                },
                overview: sanitiseHtml(input.overview)
              }))
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
        return runIfContextHasUser(context, (user) => {
          return Game
            .query()
            .where({ id, userId: user.id })
            .first()
            .then((game) => {
              if (game) {
                const payload = _.merge({}, input, {
                  gameSettings: {
                    gameStatus: game.gameSettings.gameStatus
                  },
                  overview: sanitiseHtml(input.overview)
                });

                return Game
                  .query()
                  .update(payload)
                  .where({ id })
                  .returning('*')
                  .first();
              }
            });
        });
      }),

    updateGameStatus: (obj, { id, gameStatus }, context) =>
      schemaScopeGate(['create:games'], context, () => {
        return runIfContextHasUser(context, (user) => {
          return Game
            .query()
            .where({ id, userId: user.id })
            .first()
            .then((game) => {
              if (game) {
                const gameSettings = _.merge({}, game.gameSettings, {
                  gameStatus
                });

                return Game
                  .query()
                  .update({ gameSettings })
                  .where({ id })
                  .returning('*')
                  .first();
              }
            });
        });
      })
  }
};
