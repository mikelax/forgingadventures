import _ from 'lodash';
import { withFilter } from 'graphql-subscriptions';
import { raw } from 'objection';

import GameMessage from 'models/gameMessage';
import schemaScopeGate from 'services/schemaScopeGate';

import { getUser } from 'services/user';
import pubsub from 'services/pubsub';
import User from '../models/user';

export const TOPIC_MESSAGE_ADDED = 'topic_message_added';
export const TOPIC_MESSAGE_UPDATED = 'topic_message_updated';

export const gameMessageTypeDefs = `

  type GameMessage {
    id: ID!,
    gameId: ID!,
    user: User!,
    message: JSON!,
    numberEdits: Int!,
    updated_at: GraphQLDateTime,
    created_at: GraphQLDateTime
  }
  
  input CreateGameMessageInput {
    gameId: ID!,
    message: JSON!
  }
  
  input UpdateGameMessageInput {
    message: JSON!
  }
`;

export const gameMessageResolvers = {
  GameMessage: {
    user: gameMessage => User.query().findById(gameMessage.userId)
  },
  Query: {
    gameMessage: (obj, { id }) =>
      GameMessage.query().findById(id),

    gameMessages: (obj, { gameId }) =>
      GameMessage.query().where({ gameId }).orderBy('created_at')
  },
  Mutation: {
    createGameMessage: (obj, { input }, context) =>
      schemaScopeGate(['create:posts'], context, () => {
        return getUser(context.req.user.sub)
          .then((user) => {
            input.userId = user.id;

            return GameMessage
              .query()
              .insert(input)
              .returning('*')
              .execute()
              .tap((gameMessage) => {
                pubsub.publish(TOPIC_MESSAGE_ADDED, {
                  messageAdded: gameMessage
                });
              });
          });
      }),
    updateGameMessage: (obj, { id, input }, context) =>
      schemaScopeGate(['create:posts'], context, () => {
        return getUser(context.req.user.sub)
          .then((user) => {
            return GameMessage
              .query()
              .count('*')
              .where('id', id)
              .where('userId', user.id) // May refactor to consider allowing admin or GM to edit
              .first()
              .execute();
          })
          .then((rowCount) => {
            // In PG count returns as String from knex
            if (_.eq(rowCount.count, '1')) {
              return GameMessage
                .query()
                .patch({
                  message: input.message,
                  numberEdits: raw('"numberEdits" + 1')
                })
                .where('id', id)
                .first()
                .returning('*')
                .execute()
                .tap((gameMessage) => {
                  pubsub.publish(TOPIC_MESSAGE_UPDATED, {
                    messageUpdated: gameMessage
                  });
                });
            }
          });
      })
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator(TOPIC_MESSAGE_ADDED), (payload, variables) => {
        return payload.messageAdded.gameId === Number(variables.gameId);
      })
    },
    messageUpdated: {
      subscribe: withFilter(() => pubsub.asyncIterator(TOPIC_MESSAGE_UPDATED), (payload, variables) => {
        return payload.messageUpdated.gameId === Number(variables.gameId);
      })
    }
  }
};
