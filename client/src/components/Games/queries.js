import gql from 'graphql-tag';

export const gamesQuery = gql`
  query games($page: Int, $searchOptions: SearchOptions) {
    games(page: $page, searchOptions: $searchOptions) {
      id
      title
      scenario
      overview
      gameSettings {
        minPlayers
        maxPlayers
        skillLevel
        postingFrequency
      }
    }
  }
`;

export const gameQuery = gql`
  query game($id: ID!) {
    game(id: $id) {
      id
      title
      scenario
      overview
    }
  }
`;

export const gameMessagesQuery = gql`
  query gameMessages($gameId: ID!) {
    gameMessages(gameId: $gameId) {
      id
      message
    }
  }
`;

export const gameLoungeMessagesQuery = gql`
  query gameLoungeMessages($gameId: ID!) {
    gameLoungeMessages(gameId: $gameId) {
      id
      message
    }
  }
`;

export const createGameMutation = gql`
  mutation createGame($input: CreateGameInput) {
    createGame(input: $input) {
      id
      title
    }
  }
`;

export const createGameMessageMutation = gql`
  mutation createGameMessage($input: CreateGameMessageInput) {
    createGameMessage(input: $input) {
      id
      gameId
      message
    }
  }
`;

export const createGameLoungeMessageMutation = gql`
  mutation createGameLoungeMessage($input: CreateGameLoungeMessageInput) {
    createGameLoungeMessage(input: $input) {
      id
      gameId
      message
      user {
        name
      }     
    }
  }
`;

export const onGameMessageAdded = gql`
  subscription messageAdded($gameId: ID!){
    messageAdded(gameId: $gameId){
      id
      gameId
      message
    }
  }
`;

export const onGameLoungeMessageAdded = gql`
  subscription gameLoungeMessageAdded($gameId: ID!){
    gameLoungeMessageAdded(gameId: $gameId){
      id
      gameId
      message
    }
  }
`;