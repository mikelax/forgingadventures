import { getUser } from 'services/user';

export const userTypeDefs = `

  type User {
    id: Int!,
    name: String,
    userMetadata: UserMetadata,
    appMetadata: AppMetadata
  }
  
  type UserMetadata {
    profileImage: String,
    username: String,
  }
  
  type AppMetadata {
    faUserId: Int,
    signupCompleted: Boolean
  }
  
  
  input UserMetadataInput {
    profileImage: String,
    username: String!,
  }
  
  input UpdateUserDetailsInput {
    name: String!,
    userMetadata: UserMetadataInput
  }
  
`;

export const userResolvers = {
  Query: {
    me: (obj, obj2, context) => getUser(context.req.user.sub)
  },
  Mutation: {
    updateMe: (obj, { input }, context ) => {

    }
  }
};
