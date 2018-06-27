import _ from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';

import { characterTypeDefs, characterResolvers } from './character';
import { characterLogTypeDefs, characterTypeResolvers } from './characterLog';
import { gameTypeDefs, gameResolvers } from './game';
import { gameLabelTypeDefs, gameLabelResolvers } from './gameLabel';
import { gameLoungeTypeDefs, gameLoungeResolvers } from './gameLounge';
import { gameMessageTypeDefs, gameMessageResolvers } from './gameMessage';
import { gamePlayerTypeDefs, gamePlayerResolvers } from './gamePlayer';
import { userTypeDefs, userResolvers } from './user';

const scalars = `
  scalar JSON
  scalar GraphQLDateTime
`;

// define base types here so that we can include Query, Mutation and Subscription
// in each typeDef file
const Query = `
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
`;

const ScalerResolvers = {
  JSON: GraphQLJSON,
  GraphQLDateTime
};

export default makeExecutableSchema({
  typeDefs: [
    Query,
    characterTypeDefs,
    characterLogTypeDefs,
    gameTypeDefs,
    gameLabelTypeDefs,
    gameLoungeTypeDefs,
    gameMessageTypeDefs,
    gamePlayerTypeDefs,
    userTypeDefs,
    scalars
  ],
  resolvers: _.merge(
    ScalerResolvers,
    characterResolvers,
    characterTypeResolvers,
    gameResolvers,
    gameLabelResolvers,
    gameLoungeResolvers,
    gameMessageResolvers,
    gamePlayerResolvers,
    userResolvers
  )
});
