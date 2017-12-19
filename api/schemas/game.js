import { makeExecutableSchema } from 'graphql-tools';

import Game from 'models/game';
import schemaScopeGate from 'services/schemaScopeGate';
import getUser from 'services/user';

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
    game: (obj, { id }) =>
      Game.query().findById(id),

    games: () =>
      Game.query()
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
