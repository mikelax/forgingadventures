const mutations = `
  type Mutation {
    # games
    createGame(input: CreateGameInput): Game
    updateGame(id: ID!, input: UpdateGameInput): Game
    updateGameStatus(id: ID!, gameStatus: Int): Game
    
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

    # characters
    createCharacter(input: CreateCharacterInput): Character
    updateCharacter(id: ID!, input: UpdateCharacterInput): Character
  }
`;

export default mutations;
