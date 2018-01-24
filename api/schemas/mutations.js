const mutations = `
  type Mutation {
    # games
    createGame(input: CreateGameInput): Game
    
    # game_messages
    createGameMessage(input: CreateGameMessageInput): GameMessage
    updateGameMessage(id: ID!, input: UpdateGameMessageInput): GameMessage
    
    # game_lounges
    createGameLoungeMessage(input: CreateGameLoungeMessageInput): GameLoungeMessage
    updateGameLoungeMessage(id: ID!, input: UpdateGameLoungeMessageInput): GameLoungeMessage

    # user
    updateMe(input: UpdateUserDetailsInput): User!
    validUsername(username: String!): Boolean

    # game_players
    createGamePlayer(input: CreateGamePlayerInput): GamePlayer
    updateGamePlayer(id: ID!, input: UpdateGamePlayerInput): GamePlayer
  }
`;

export default mutations;
