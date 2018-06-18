import GameLabel from 'models/gameLabel';

export const gameLabelTypeDefs = `

  extend type Query {
    gameLabel(id: ID!): GameLabel!
    gameLabels: [GameLabel]
  }
  
  type GameLabel {
    id: ID!,
    displayName: String!,
    shortName: String!,
    aliases: [String],
    displayOrder: Int!
  }
`;

export const gameLabelResolvers = {
  Query: {
    gameLabel: (obj, { id }) =>
      GameLabel.query().findById(id),

    gameLabels: () =>
      GameLabel.query().orderBy('displayOrder')
  }
};
