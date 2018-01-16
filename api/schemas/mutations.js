const mutations = `
  type Mutation {
    createGame(input: CreateGameInput): Game
    createGameLoungeMessage(input: CreateGameLoungeMessageInput): GameLoungeMessage
    createGameMessage(input: CreateGameMessageInput): GameMessage
  }
`;

export default mutations;
