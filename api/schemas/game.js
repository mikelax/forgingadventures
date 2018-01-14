import { makeExecutableSchema } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';

import Game from 'models/game';

import schemaScopeGate from 'services/schemaScopeGate';
import GetGames from 'services/games/getGames';
import getUser from 'services/user';

import serviceExecutor from 'utils/serviceExecutor';

const typeDefs = `
  scalar JSON
  
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
    games(page: Int, searchOptions: JSON): [Game],
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
`;

const resolvers = {
  Query: {
    game: (obj, { id }) =>
      Game.query().findById(id),

    games: (obj, { page, searchOptions }) => {
      console.log('page', page);
      console.log('searchOptions', searchOptions);
      return serviceExecutor(GetGames, { page, searchOptions });
    }
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
  },
  JSON: GraphQLJSON
};

export default makeExecutableSchema({ typeDefs, resolvers });
