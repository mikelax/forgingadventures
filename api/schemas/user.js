import User from 'models/user';

export const userTypeDefs = `

  type User {
    id: ID!,
    name: String!,
    userMetadata: UserMetadata
  }
  
  type UserMetadata {
    profileImage: ProfileImage
  }
  
  type ProfileImage {
    publicId: String,
    imageUrl: String
  }  
`;

export const userResolvers = {
  Query: {
    user: (obj, { id }) => User.query().findById(id)
  }
};
