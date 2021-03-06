import gql from 'graphql-tag';

export const characterFields = `
  fragment characterFields on Character {
    id
    userId
    name
    labelId
    label {
      displayName
      shortName
    }
    characterDetails
    profileImage {
      url
      publicId
    }
  }
`;

export const myCharactersQuery = gql`
  query myCharacters {
    myCharacters {
        activeGamePlayer {
          status
          game {
            id
            title
          }
        }
      ...characterFields
    }
  }
  ${characterFields}
`;

export const myCharactersSummaryQuery = gql`
  query {
    myCharactersSummary {
      charactersCount
    }
  }
`;

export const characterQuery = gql`
  query character($id: ID!) {
    character(id: $id) {
      ...characterFields
    }
  }
  ${characterFields}
`;

export const availableCharactersQuery = gql`
  query availableCharacters($gameId: Int!) {
    availableCharacters(gameId: $gameId) {
      ...characterFields
    }
  }
  ${characterFields}
`;

export const createCharacterMutation = gql`
  mutation createCharacter($input: CreateCharacterInput) {
    createCharacter(input: $input) {
      ...characterFields
    }
  }
  ${characterFields}
`;

export const updateCharacterMutation = gql`
  mutation updateCharacter($id: ID!, $input: UpdateCharacterInput) {
    updateCharacter(id: $id, input: $input) {
      ...characterFields
    }
  }
  ${characterFields}
`;

export const quickUpdateCharacterMutation = gql`
  mutation quickUpdateCharacter($id: ID!, $input: QuickUpdateCharacterInput) {
    quickUpdateCharacter(id: $id, input: $input) {
      ...characterFields
    }
  }
  ${characterFields}
`;
