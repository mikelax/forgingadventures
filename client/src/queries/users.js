import gql from 'graphql-tag';

export const userFields = `
  fragment userFields on User {
    name
    
    userMetadata {
      username
      profileImage
    }
    
    appMetadata {
      signupCompleted
    }
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
