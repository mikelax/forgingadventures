import gql from 'graphql-tag';

// games

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


export const gamesQuery = gql`
  query games($offset: Int, $searchOptions: SearchOptions) {
    games(offset: $offset, searchOptions: $searchOptions) {
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

export const createGameMutation = gql`
  mutation createGame($input: CreateGameInput) {
    createGame(input: $input) {
      id
      title
    }
  }
`;


// game messages

export const gameMessagesQuery = gql`
  query gameMessages($gameId: ID!) {
    gameMessages(gameId: $gameId) {
      id
      message
      numberEdits
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

export const updateGameMessageMutation = gql`
  mutation updateGameMessage($id: ID!, $input: UpdateGameMessageInput) {
    updateGameMessage(id: $id, input: $input) {
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
      numberEdits
    }
  }
`;

export const onGameMessageUpdated = gql`
  subscription messageUpdated($gameId: ID!){
    messageUpdated(gameId: $gameId){
      id
      gameId
      message
      numberEdits
    }
  }
`;

// game lounge messages

export const gameLoungeMessagesQuery = gql`
  query gameLoungeMessages($gameId: ID!) {
    gameLoungeMessages(gameId: $gameId) {
      id
      message
      numberEdits
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

export const updateGameLoungeMessageMutation = gql`
  mutation updateGameLoungeMessage($input: UpdateGameLoungeMessageInput) {
    updateGameLoungeMessage(input: $input) {
      id
      gameId
      message
      user {
        name
      } 
    }      
  }    
`;


export const onGameLoungeMessageAdded = gql`
  subscription gameLoungeMessageAdded($gameId: ID!){
    gameLoungeMessageAdded(gameId: $gameId){
      id
      message
    }
  }
`;

export const onGameLoungeMessageUpdated = gql`
  subscription gameLoungeMessageUpdated($gameId: ID!){
    gameLoungeMessageUpdated(gameId: $gameId){
      id
      message
    }
  }
`;
