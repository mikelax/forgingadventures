import Character from 'models/character';
import Game from 'models/game';
import GamePlayer from 'models/gamePlayer';
import schemaScopeGate from 'services/schemaScopeGate';
import { getOrCreateUserByAuth0Id, runIfContextHasUser } from 'services/user';

export const characterTypeDefs = `

  extend type Query {
    character(id: ID!): Character!
    availableCharacters(gameId: Int!): [Character]
    myCharacters: [Character]
  }

  extend type Mutation {
    createCharacter(input: CreateCharacterInput): Character
    updateCharacter(id: ID!, input: UpdateCharacterInput): Character
  }

  type Character {
    id: ID!,
    name: String!,
    profileImage: ProfileImage,
    user: User!,
    labelId: ID!,
    label: GameLabel!,
    characterDetails: JSON,
    gamePlayer: [GamePlayer],
    activeGamePlayer: GamePlayer,
    updatedAt: GraphQLDateTime,
    createdAt: GraphQLDateTime
  }

  input CreateCharacterInput {
    characterDetails: JSON!,
    name: String!,
    labelId: Int!,
    profileImage: ProfileImageInput
  }

  input UpdateCharacterInput {
    characterDetails: JSON!,
    name: String!,
    labelId: Int!,
    profileImage: ProfileImageInput
  }
`;

export const characterResolvers = {
  Character: {
    label: (character, vars, context) => context.loaders.gameLabels.load(character.labelId),
    gamePlayer: (character) => {
      return GamePlayer.query()
        .where({ characterId: character.id });
    },
    activeGamePlayer: (character) => {
      return GamePlayer.query()
        .whereIn('status', ['pending', 'accepted'])
        .where({ characterId: character.id })
        .first();
    }
  },
  Query: {
    availableCharacters: (obj, { gameId }, context) => {
      return runIfContextHasUser(context, (user) => {
        return Character.query()
          .where('labelId', Game.query().select('labelId').where({ id: gameId }).first())
          .whereNotIn('id', GamePlayer.query().select('characterId')
            .where({ userId: user.id }).whereNotNull('characterId')
            .whereIn('status', ['pending', 'accepted']))
          .where({ userId: user.id })
          .orderBy('updatedAt', 'desc');
      });
    },
    character: (obj, { id }) => Character.query().findById(id),
    myCharacters: (obj, variables, context) => {
      return runIfContextHasUser(context, (user) => {
        return Character
          .query()
          .where({ userId: user.id })
          .orderBy('updatedAt', 'desc');
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
      }),
    updateCharacter: (obj, { id, input }, context) =>
      schemaScopeGate(['create:characters'], context, () => {
        return runIfContextHasUser(context, (user) => {
          return Character
            .query()
            .where({ id, userId: user.id })
            .first()
            .then((character) => {
              if (character) {
                return Character
                  .query()
                  .update(input)
                  .where({ id })
                  .returning('*')
                  .first();
              }
            });
        });
      })
  }
};
