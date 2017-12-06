import { makeExecutableSchema } from 'graphql-tools';

import Game from 'models/game';
import schemaScopeGate from 'services/schemaScopeGate';

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
    games: [Game],
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
    game: (obj, { id }, context) =>
      schemaScopeGate(['read:messages'], context, () =>
        Game.query().findById(id)),

    games: (obj, params, context) =>
      schemaScopeGate(['read:messages'], context, () =>
        Game.query())
  },
  Mutation: {
    createGame: (obj, { input }, context) =>
      schemaScopeGate(['write:messages'], context, () =>
        Game
          .query()
          .insert(input)
          .returning('*'))
  }
};

export default makeExecutableSchema({ typeDefs, resolvers });
