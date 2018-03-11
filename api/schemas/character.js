import Character from 'models/character';
import schemaScopeGate from 'services/schemaScopeGate';
import { getOrCreateUserByAuth0Id, runIfContextHasUser } from 'services/user';

export const characterTypeDefs = `
  type Character {
    id: ID!,
    name: String!,
    profileImage: ProfileImage,
    user: User!,
    label: GameLabel!,
    updated_at: GraphQLDateTime,
    created_at: GraphQLDateTime
  }

  input CreateCharacterInput {
    name: String!,
    labelId: Int!,
    profileImage: ProfileImageInput
  }
`;

export const characterResolvers = {
  Character: {
    label: (character, vars, context) => context.loaders.gameLabels.load(character.labelId)
  },
  Query: {
    character: (obj, { id }) => Character.query().findById(id),
    myCharacters: (obj, variables, context) => {
      return runIfContextHasUser(context, (user) => {
        return Character
          .query()
          .where({ userId: user.id })
          .orderBy('updated_at', 'desc');
      });
    }
  },
  Mutation: {
    createCharacter: (obj, { input }, context) =>
      schemaScopeGate(['create:characters'], context, () => {
        return getOrCreateUserByAuth0Id(context.req.user.sub)
          .then((user) => {
            input.userId = user.id;

            return Character
              .query()
              .insert(input)
              .returning('*')
              .execute();
          });
      })
  }
};
