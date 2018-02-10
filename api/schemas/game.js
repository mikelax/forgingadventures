import Game from 'models/game';
import GameLabel from 'models/gameLabel';
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
    postingFrequency: Int!
  }
  
  type Game {
    id: ID!,
    label: GameLabel!,
    title: String!,
    scenario: String!,
    overview: String!,
    gameSettings: GameSetting!,
    gameImage: ProfileImage
  }
  
  input CreateGameInput {
    title: String!,
    scenario: String!,
    overview: String!,
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
  }
  
  input gameSettingsSearchOptions {
    skillLevel: Int,
    postingFrequency: Int,
    gameStatus: Int
  }
`;

export const gameResolvers = {
  Game: {
    label: game => GameLabel.query().findById(game.labelId)
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
            input.userId = user.id;
            // TODO Remove when label is added to create screen
            input.labelId = 1;
            return Game
              .query()
              .insert(input)
              .returning('*');
          })
          .tap((gameResponse) => {
            const playerInput = {
              gameId: gameResponse.id,
              userId: gameResponse.userId,
              status: 'game-master'
            };
            return GamePlayer.query()
              .insert(playerInput);
          });
      })
  }
};
