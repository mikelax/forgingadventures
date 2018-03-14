import gql from 'graphql-tag';

export const characterFields = `
  fragment characterFields on Character {
    id
    name
    label {
      id
      displayName
      shortName
    }
    profileImage {
      url
      publicId
    }
  }
`;

export const myCharactersQuery = gql`
  query myCharacters {
    myCharacters {
      ...characterFields
    }
  }
  ${characterFields}
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
  query availableCharacters($gameId: String!) {
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
