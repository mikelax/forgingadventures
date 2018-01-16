const subscriptions = `
  type Subscription {
    gameLoungeMessageAdded(gameId: ID!): GameLoungeMessage!
    messageAdded(gameId: ID!): GameMessage!
  }
`;

export default subscriptions;
