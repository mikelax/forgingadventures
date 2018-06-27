import CharacterLog from 'models/characterLog';

export const characterLogTypeDefs = `

  extend type Query {
    characterLog(id: ID!): CharacterLog!
    characterHistory(characterId: ID!): [CharacterLog]!
  }

  type CharacterLog {
    id: ID!,
    characterId: ID!,
    previousCharacterLogId: ID,
    character: Character!,
    previousCharacterLog: CharacterLog,
    characterDetails: JSON!,
    createdAt: GraphQLDateTime!
  }
`;

export const characterTypeResolvers = {
  CharacterLog: {
    character: (characterLog, vars, context) => context.loaders.characters.load(characterLog.characterId),
    previousCharacterLog: (characterLog, vars, context) =>
      context.loaders.characterLogs.load(characterLog.previousCharacterLogId)
  },
  Query: {
    characterLog: (obj, { id }) => CharacterLog.query().findById(id),
    characterHistory: (obj, { characterId }) => CharacterLog.query().where({ characterId }).orderBy('createdAt')
  }
};
