const subscriptions = `
  type Subscription {
    gameLoungeMessageAdded(gameId: ID!): GameLoungeMessage!
    messageAdded(gameId: ID!): GameMessage!
    messageUpdated(gameId: ID!): GameMessage!
  }
`;

export default subscriptions;
