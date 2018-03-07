const queries = `
  type Query {
    # games
    game(id: ID!): Game!
    games(offset: Int, searchOptions: SearchOptions): [Game]
    myGames(status: [String]): [Game]

    # game labels
    gameLabel(id: ID!): GameLabel!
    gameLabels: [GameLabel]
    
    # game messages
    gameMessage(id: ID!): GameMessage!
    gameMessages(gameId: ID!): [GameMessage!]
    
    # game lounge message
    gameLoungeMessage(id: ID!): GameLoungeMessage!
    gameLoungeMessages(gameId: ID!): [GameLoungeMessage!]

    # game players
    gamePlayer(id: ID!): GamePlayer!,
    myGamePlayer(gameId: ID!): [GamePlayer],
    myGamePlayers: [GamePlayer],
    gamePlayers(gameId: ID!, status: [String]): [GamePlayer!]
    
    # users
    me: User
  }
`;

export default queries;
