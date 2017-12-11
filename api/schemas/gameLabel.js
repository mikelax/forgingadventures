import { makeExecutableSchema } from 'graphql-tools';

import GameLabel from 'models/gameLabel';

const typeDefs = `
  type GameLabel {
    id: ID!,
    displayName: String!,
    shortName: String!,
    aliases: [String],
    displayOrder: Int!
  }

  type Query {
    gameLabels: [GameLabel],
    gameLabel(id: ID!): GameLabel!
  }
`;

const resolvers = {
  Query: {
    gameLabel: (obj, { id }) =>
      GameLabel.query().findById(id),

    gameLabels: () =>
      GameLabel.query()
  }
};

export default makeExecutableSchema({ typeDefs, resolvers });
