import gql from 'graphql-tag';
import { gamePlayerFields } from '../components/Games/queries';

export const userFields = `
  fragment userFields on User {
    id
    name
    username
    profileImage {
      url
      publicId
    }
    completedAt
    timezone

    updatedAt
  }
`;

export const meQuery = gql`
  query {
    me {
      ...userFields
    }
  }
  ${userFields}
`;

export const myGamePlayersQuery = gql`
  query  {
    myGamePlayers {
      ...gamePlayerFields
    }
  }
  ${gamePlayerFields}
`;

export const validUsernameQuery = gql`
  mutation validUsername($username: String!) {
    validUsername(username: $username)
  }
`;

export const updateMeMutation = gql`
  mutation updateMe($input: UpdateUserDetailsInput) {
    updateMe(input: $input) {
      ...userFields
    }
  }
  ${userFields}
`;
