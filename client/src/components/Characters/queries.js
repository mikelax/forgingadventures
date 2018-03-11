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

// Queries

export const myCharactersQuery = gql`
  query myCharacters {
    myCharacters {
      ...characterFields
    }
  }
  ${characterFields}
`;
