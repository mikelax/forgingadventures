import _ from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';

import { gameTypeDefs, gameResolvers } from 'schemas/game';
import { gameLabelTypeDefs, gameLabelResolvers } from 'schemas/gameLabel';
import { gameLoungeTypeDefs, gameLoungeResolvers } from 'schemas/gameLounge';
import { gameMessageTypeDefs, gameMessageResolvers } from 'schemas/gameMessage';
import { gamePlayerTypeDefs, gamePlayerResolvers } from 'schemas/gamePlayer';
import { userTypeDefs, userResolvers } from 'schemas/user';

import queries from 'schemas/queries';
import mutations from 'schemas/mutations';
import subscriptions from 'schemas/subscriptions';

const scalars = `
  scalar JSON
  scalar GraphQLDateTime
`;

const ScalerResolvers = {
  JSON: GraphQLJSON,
  GraphQLDateTime
};

export default makeExecutableSchema({
  typeDefs: [
    gameTypeDefs,
    gameLabelTypeDefs,
    gameLoungeTypeDefs,
    gameMessageTypeDefs,
    gamePlayerTypeDefs,
    userTypeDefs,
    queries,
    mutations,
    subscriptions,
    scalars
  ],
  resolvers: _.merge(
    ScalerResolvers,
    gameResolvers,
    gameLabelResolvers,
    gameLoungeResolvers,
    gameMessageResolvers,
    gamePlayerResolvers,
    userResolvers
  )
});

