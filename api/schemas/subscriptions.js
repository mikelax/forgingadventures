const subscriptions = `
  type Subscription {
    # game messages
    messageAdded(gameId: ID!): GameMessage!
    messageUpdated(gameId: ID!): GameMessage!

    # game lounge messages
    gameLoungeMessageAdded(gameId: ID!): GameLoungeMessage!
    gameLoungeMessageUpdated(gameId: ID!): GameLoungeMessage!

    # game players
    gamePlayerAdded(gameId: ID!): GamePlayer!
    gamePlayerUpdated(gameId: ID!): GamePlayer!
  }
`;

export default subscriptions;
