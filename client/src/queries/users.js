import gql from 'graphql-tag';

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
    
    updated_at
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

