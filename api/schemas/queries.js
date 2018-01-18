const queries = `
  type Query {
    # games
    game(id: ID!): Game!
    games(offset: Int, searchOptions: SearchOptions): [Game],

    # game labels
    gameLabel(id: ID!): GameLabel!
    gameLabels: [GameLabel],
    
    # game messages
    gameMessage(id: ID!): GameMessage!,
    gameMessages(gameId: ID!): [GameMessage!]
    
    # game lounge message
    gameLoungeMessage(id: ID!): GameLoungeMessage!,
    gameLoungeMessages(gameId: ID!): [GameLoungeMessage!]
    
    # users
    user(id: ID!): User!
  }
`;

export default queries;