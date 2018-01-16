import { withFilter } from 'graphql-subscriptions';

import GameMessage from 'models/gameMessage';
import schemaScopeGate from 'services/schemaScopeGate';

import { getUser } from 'services/user';
import pubsub from 'services/pubsub';

export const TOPIC_MESSAGE_ADDED = 'topic_message_added';

export const gameMessageTypeDefs = `

  type GameMessage {
    id: ID!,
    gameId: ID!,
    message: JSON!
  }
  
  input CreateGameMessageInput {
    gameId: ID!,
    message: JSON!
  }
`;

export const gameMessageResolvers = {
  Query: {
    message: (obj, { id }, context) =>
      schemaScopeGate(['create:posts'], context, () =>
        GameMessage.query().findById(id)),

    gameMessages: (obj, { gameId }, context) =>
      schemaScopeGate(['create:posts'], context, () =>
        GameMessage.query().where({ gameId }))
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
      })
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator(TOPIC_MESSAGE_ADDED), (payload, variables) => {
        return payload.messageAdded.gameId === Number(variables.gameId);
      })
    }
  }
};
