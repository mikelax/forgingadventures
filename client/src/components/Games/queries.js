import gql from 'graphql-tag';

// fragments

// users

export const userMetadataFields = `
  fragment userMetadataFields on UserMetadata {
    profileImage {
      imageUrl
    }
  }
`;

// queries


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
      created_at
      updated_at
    }
  }
`;

export const createGameMessageMutation = gql`
  mutation createGameMessage($input: CreateGameMessageInput) {
    createGameMessage(input: $input) {
      id
      gameId
      message
      created_at
    }
  }
`;

export const updateGameMessageMutation = gql`
  mutation updateGameMessage($id: ID!, $input: UpdateGameMessageInput) {
    updateGameMessage(id: $id, input: $input) {
      id
      message
      updated_at      
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
      created_at
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
      created_at
      updated_at
      user {
        name
        userMetadata { ...userMetadataFields }
      }
    }
  }
  ${userMetadataFields}
`;

export const createGameLoungeMessageMutation = gql`
  mutation createGameLoungeMessage($input: CreateGameLoungeMessageInput) {
    createGameLoungeMessage(input: $input) {
      id
      message
      numberEdits
      created_at
      updated_at
      user {
        name
        userMetadata { ...userMetadataFields }
      }
    }      
  }
  ${userMetadataFields}    
`;

export const updateGameLoungeMessageMutation = gql`
  mutation updateGameLoungeMessage($id: ID!, $input: UpdateGameLoungeMessageInput) {
    updateGameLoungeMessage(id: $id, input: $input) {
      id
      message
      numberEdits
      updated_at
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
      numberEdits
      updated_at
    }
  }
`;
