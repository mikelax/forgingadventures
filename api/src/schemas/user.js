import { updateUserAndAuth0, runIfContextHasUser } from 'services/user';
import User from 'models/user';

export const userTypeDefs = `

  extend type Query {
    me: User
  }

  extend type Mutation {
    updateMe(input: UpdateUserDetailsInput): User!
    validUsername(username: String!): Boolean
  }

  type User {
    id: ID!,
    name: String,
    username: String,
    timezone: String,
    completedAt: GraphQLDateTime,
    profileImage: ProfileImage,
    createdAt: GraphQLDateTime,
    updatedAt: GraphQLDateTime
  }

  type ProfileImage {
    url: String,
    publicId: String,
    userUploadId: Int
  }

  input ProfileImageInput {
    publicId: String,
    userUploadId: Int,
    url: String
  }

  input UpdateUserDetailsInput {
    name: String!,
    username: String,
    timezone: String,
    profileImage: ProfileImageInput
  }

`;

export const userResolvers = {
  Query: {
    me: (obj, obj2, context) => runIfContextHasUser(context, user => user)
  },
  Mutation: {
    updateMe: (obj, { input }, context) => updateUserAndAuth0(input, context.req.user.sub),
    validUsername: (obj, { username }, context) => {
      return User
        .query()
        .count('username')
        .where({ username })
        .where('auth0UserId', '!=', context.req.user.sub)
        .first()
        .then(res => Number(res.count) === 0);
    }
  }
};
