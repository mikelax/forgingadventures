import { makeExecutableSchema } from 'graphql-tools';

import Game from 'models/game';

import schemaScopeGate from 'services/schemaScopeGate';
import GetGames from 'services/games/getGames';
import getUser from 'services/user';

import serviceExecutor from 'utils/serviceExecutor';

const typeDefs = `
  type GameSetting {
    minPlayers: Int!,
    maxPlayers: Int!,
    skillLevel: Int!,
    postingFrequency: Int!
  }
  
  type Game {
    id: ID!,
    title: String!,
    scenario: String!,
    overview: String!,
    gameSettings: GameSetting!
  }
  
  # queries
  type Query {
    games(page: Int, searchOptions: SearchOptions): [Game],
    game(id: ID!): Game!
  }
  
  # mutations
  type Mutation {
    createGame(input: CreateGameInput): Game
  }
  
  input CreateGameInput {
    title: String!,
    scenario: String!,
    overview: String!,
    gameSettings: GameSettingInput!
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
    status: Int
  }
`;

const resolvers = {
  Query: {
    game: (parent, { id }) => Game.query().findById(id),
    games: (parent, { page, searchOptions }) => serviceExecutor(GetGames, { page, searchOptions })
  },
  Mutation: {
    createGame: (obj, { input }, context) =>
      schemaScopeGate(['create:games'], context, () => {
        // TODO consider writing function to automaticaly add userId to input
        return getUser(context.req.user.sub)
          .then((user) => {
            input.userId = user.id;
            return Game
              .query()
              .insert(input)
              .returning('*');
          });
      })
  }
};

export default makeExecutableSchema({ typeDefs, resolvers });
