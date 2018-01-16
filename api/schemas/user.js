import User from 'models/user';

export const userTypeDefs = `

  type User {
    id: ID!,
    name: String!,
    userMetaData: UserMetaData!
  }
  
  type UserMetaData {
    profileImage: ProfileImage!
  }
  
  type ProfileImage {
    publicId: String,
    imageUrl: String!
  }  
`;

export const userResolvers = {
  Query: {
    user: (obj, { id }) => User.query().findById(id)
  }
};
