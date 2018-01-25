import { getOrCreateUserByAuth0Id } from 'services/user';
import User from '../models/user';

export const userTypeDefs = `

  type User {
    id: Int!,
    name: String,
    username: String,
    timezone: String,
    completedAt: GraphQLDateTime,
    profileImage: ProfileImage,
    created_at: GraphQLDateTime,
    updated_at: GraphQLDateTime
  }
  
  type ProfileImage {
    url: String,
    publicId: String,
    userUploadsId: Int
  }
  
  input UpdateUserDetailsInput {
    name: String!,
    username: String,
    timezone: String,
    profileImageUrl: String
  }
  
`;

export const userResolvers = {
  Query: {
    me: (obj, obj2, context) => getOrCreateUserByAuth0Id(context.req.user.sub)
  },
  Mutation: {
    updateMe: (obj, { input }, context) => {

    },
    validUsername: (obj, { username }) => {
      return User
        .query()
        .count('username')
        .where({ username })
        .first()
        .then(res => Number(res.count) === 0);
    }
  }
};
