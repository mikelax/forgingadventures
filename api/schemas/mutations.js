const mutations = `
  type Mutation {
    # games
    createGame(input: CreateGameInput): Game
    
    # game_messages
    createGameMessage(input: CreateGameMessageInput): GameMessage
    updateGameMessage(id: ID!, input: UpdateGameMessageInput): GameMessage
    
    # game_lounges
    createGameLoungeMessage(input: CreateGameLoungeMessageInput): GameLoungeMessage
  }
`;

export default mutations;
