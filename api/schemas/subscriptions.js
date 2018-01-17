const subscriptions = `
  type Subscription {
    # game messages
    messageAdded(gameId: ID!): GameMessage!
    messageUpdated(gameId: ID!): GameMessage!

    # game lounge messages
    gameLoungeMessageAdded(gameId: ID!): GameLoungeMessage!
  }
`;

export default subscriptions;
