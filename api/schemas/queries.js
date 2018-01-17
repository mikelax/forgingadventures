const queries = `
  type Query {
    game(id: ID!): Game!
    gameLabel(id: ID!): GameLabel!
    gameLabels: [GameLabel],
    gameLoungeMessage(id: ID!): GameLoungeMessage!,
    gameLoungeMessages(gameId: ID!): [GameLoungeMessage!]
    gameMessages(gameId: ID!): [GameMessage!]
    games(offset: Int, searchOptions: SearchOptions): [Game],
    message(id: ID!): GameMessage!,
    user(id: ID!): User!
  }
`;

export default queries;
