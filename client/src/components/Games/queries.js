import gql from 'graphql-tag';

export const gamesQuery = gql`
  query {
    games{
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

export const onGameMessageAdded = gql`
  subscription messageAdded($gameId: ID!){
    messageAdded(gameId: $gameId){
      id
      gameId
      message
    }
  }
`;