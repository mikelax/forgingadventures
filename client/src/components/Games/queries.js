import gql from 'graphql-tag';

// fragments

// game

export const gameFields = `
fragment gameFields on Game {
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
  gameImage {
    url
    publicId
  }
  label {
    id
    displayName
    shortName
  }
}
`;

// game messages

export const gameMessageFields = `
  fragment gameMessagesFields on GameMessage {
    id
    gameId
    message
    numberEdits
    created_at
    updated_at
    user {
      id
    }
  }
`;

// game lounge messages

export const gameLoungeMessageFields = `
  fragment gameLoungeMessagesFields on GameLoungeMessage {
    id
    message
    numberEdits
    meta
    created_at
    updated_at
    user {
      id
      name
      profileImage {
        url 
      }
    }
  }
`;

// game players

export const gamePlayerFields = `
  fragment gamePlayerFields on GamePlayer {
    id
    status
    user {
      id
      name
      profileImage {
        url 
      }
    }
  }
`;

export const createGamePlayerMutation = gql`
  mutation createGamePlayer($input: CreateGamePlayerInput) {
    createGamePlayer(input: $input) {
      ...gamePlayerFields
    }
  }
  ${gamePlayerFields}
`;

export const updateGamePlayerMutation = gql`
  mutation updateGamePlayer($id: ID!, $input: UpdateGamePlayerInput) {
    updateGamePlayer(id: $id, input: $input) {
      ...gamePlayerFields
    }
  }
  ${gamePlayerFields}
`;

// queries


// games

export const gameQuery = gql`
  query game($id: ID!) {
    game(id: $id) {
      ...gameFields
    }
  }
  ${gameFields}
`;


export const gamesQuery = gql`
  query games($offset: Int, $searchOptions: SearchOptions) {
    games(offset: $offset, searchOptions: $searchOptions) {
      ...gameFields
    }
  }
  ${gameFields}
`;

export const createGameMutation = gql`
  mutation createGame($input: CreateGameInput) {
    createGame(input: $input) {
      ...gameFields
    }
  }
  ${gameFields}
`;

// game labels

export const gameLabelsQuery = gql`
  query {
    gameLabels {
      id
      displayName
      shortName
    }
  }
`;

// game messages

export const gameMessagesQuery = gql`
  query gameMessages($gameId: ID!) {
    gameMessages(gameId: $gameId) {
      ...gameMessagesFields
    }
  }
  ${gameMessageFields}
`;

export const createGameMessageMutation = gql`
  mutation createGameMessage($input: CreateGameMessageInput) {
    createGameMessage(input: $input) {
      ...gameMessagesFields
    }
  }
  ${gameMessageFields}
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
      ...gameMessagesFields
    }
  }
  ${gameMessageFields}
`;

export const onGameMessageUpdated = gql`
  subscription messageUpdated($gameId: ID!){
    messageUpdated(gameId: $gameId){
      id
      message
      numberEdits
      updated_at
    }
  }
`;

// game players

export const gamePlayersQuery = gql`
  query gamePlayers($gameId: ID!, $status: [String]) {
    gamePlayers(gameId: $gameId, status: $status) {
      ...gamePlayerFields
    }
  }
  ${gamePlayerFields}
`;

export const myGamePlayerQuery = gql`
  query myGamePlayer($gameId: ID!) {
    myGamePlayer(gameId: $gameId) {
      ...gamePlayerFields
    }
  }
  ${gamePlayerFields}
`;

// game lounge messages

export const gameLoungeMessagesQuery = gql`
  query gameLoungeMessages($gameId: ID!) {
    gameLoungeMessages(gameId: $gameId) {
      ...gameLoungeMessagesFields
    }
  }
  ${gameLoungeMessageFields}
`;

export const createGameLoungeMessageMutation = gql`
  mutation createGameLoungeMessage($input: CreateGameLoungeMessageInput) {
    createGameLoungeMessage(input: $input) {
      ...gameLoungeMessagesFields
    }      
  }
  ${gameLoungeMessageFields}    
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
      ...gameLoungeMessagesFields
    }
  }
  ${gameLoungeMessageFields} 
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
