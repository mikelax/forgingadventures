import Character from 'models/character';
import Game from 'models/game';
import GamePlayer from 'models/gamePlayer';

import pubsub from 'services/pubsub';
import schemaScopeGate from 'services/schemaScopeGate';
import { getOrCreateUserByAuth0Id, runIfContextHasUser } from 'services/user';
import createCharacter from 'services/characters/createCharacter';
import updateCharacter from 'services/characters/updateCharacter';
import quickUpdateCharacterAndAddUpdateGameMessage from 'services/characters/quickUpdateCharacterAndAddUpdateGameMessage'; //eslint-disable-line

import { TOPIC_MESSAGE_ADDED } from './gameMessage';

import engineLoader from 'engine';

export const characterTypeDefs = `

  extend type Query {
    character(id: ID!): Character!
    availableCharacters(gameId: Int!): [Character]
    myCharacters: [Character]
    myCharactersSummary: CharacterSummary
  }

  extend type Mutation {
    createCharacter(input: CreateCharacterInput): Character
    updateCharacter(id: ID!, input: UpdateCharacterInput): Character
  }

  type Character {
    id: ID!,
    lastCharacterLogId: ID!,
    labelId: ID!,
    name: String!,
    profileImage: ProfileImage,
    user: User!,
    label: GameLabel!,
    characterDetails: JSON,
    gamePlayer: [GamePlayer],
    activeGamePlayer: GamePlayer,
    updatedAt: GraphQLDateTime,
    createdAt: GraphQLDateTime
  }

  type CharacterSummary {
    id: ID!,
    charactersCount: String
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
    profileImage: ProfileImageInput,
    changeDescription: String,
    changeMeta: JSON
  }
`;

export const characterResolvers = {
  Character: {
    label: (character, vars, context) => context.loaders.gameLabels.load(character.labelId),

    gamePlayer: (character, vars, context) => GamePlayer.query()
      .select('id')
      .where({ characterId: character.id })
      .execute()
      .map(gamePlayer => gamePlayer && context.loaders.gamePlayers.load(gamePlayer.id)),
    // TODO reconsider this association and consider just using `gamePlayer` in the UI
    activeGamePlayer: (character, vars, context) => GamePlayer.query()
      .select('id')
      .whereIn('status', ['pending', 'accepted'])
      .where({ characterId: character.id })
      .first()
      .then(gamePlayer => gamePlayer && context.loaders.gamePlayers.load(gamePlayer.id))
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
    },
    myCharactersSummary: (obj, variables, context) => {
      return runIfContextHasUser(context, (user) => {
        return Character
          .query()
          .select({ id: 1 })
          .count({ charactersCount: 1 })
          .where({ userId: user.id })
          .first();
      });
    }
  },
  Mutation: {
    createCharacter: (obj, { input }, context) =>
      schemaScopeGate(['create:characters'], context, () => {
        return getOrCreateUserByAuth0Id(context.req.user.sub)
          .then((user) => {
            const { labelId, characterDetails: { meta: { version } } } = input;
            const engine = engineLoader({ labelId, version });

            return createCharacter({
              user, input, engine
            });
          });
      }),
    updateCharacter: (obj, { id, input }, context) =>
      schemaScopeGate(['create:characters'], context, () => {
        return runIfContextHasUser(context, (user) => {
          const { labelId, characterDetails: { meta: { version } } } = input;
          const engine = engineLoader({ labelId, version });

          // input.changeMeta is included when quick editing a character in a game mesage
          // manage these differently to record the update and also generate a game message
          if (input.changeMeta) {
            return quickUpdateCharacterAndAddUpdateGameMessage({
              id, input, user, engine
            })
              .tap(({ gameMessage: messageAdded }) => {
                if (messageAdded) {
                  pubsub.publish(TOPIC_MESSAGE_ADDED, { messageAdded });
                }
              })
              .then(({ character }) => character);
          } else {
            return updateCharacter({
              id, input, user, engine
            });
          }
        });
      })
  }
};
