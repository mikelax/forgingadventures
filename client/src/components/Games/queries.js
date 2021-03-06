import gql from 'graphql-tag';

// fragments

// game

export const gameFields = `
fragment gameFields on Game {
  id
  user {
    id
  }
  title
  scenario
  overview
  gameSettings {
    minPlayers
    maxPlayers
    skillLevel
    postingFrequency
    gameStatus
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
    postType
    meta
    createdAt
    updatedAt

    characterLog {
      characterDetails
      character {
        id
        name
        labelId
        profileImage {
          publicId
          url
        }
      }
    }
    
    game {
      labelId
    }
    
    user {
      id
      name
      profileImage {
        publicId
        url
      }
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
    createdAt
    updatedAt
    user {
      id
      name
      profileImage {
        publicId
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
    progressGameMessageId
    user {
      id
      name
      timezone
      profileImage {
        publicId
        url
      }
    }
    character {
      id
      name
      labelId
      characterDetails
      profileImage {
        publicId
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

export const setGameMessageProgressMutation = gql`
  mutation setGameMessageProgress($gamePlayerId: ID!, $gameMessageId: ID!) {
    setGameMessageProgress(gamePlayerId: $gamePlayerId, gameMessageId: $gameMessageId) {
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

// for @connection see: https://www.apollographql.com/docs/react/features/pagination.html#connection-directive
export const gamesQuery = gql`
  query games($offset: Int, $searchOptions: SearchOptions) {
    games(offset: $offset, searchOptions: $searchOptions) @connection(key: "games", filter: ["searchOptions"]) {
      ...gameFields
    }
  }
  ${gameFields}
`;

export const myGamesQuery = gql`
  query myGames($status: [String]) {
    myGames(status: $status) {
      ...gameFields
    }
  }
  ${gameFields}
`;

export const myGamesSummaryQuery = gql`
  query myGamesSummary {
    myGamesSummary {
      status
      statusCount
    }
  }
`;

export const createGameMutation = gql`
  mutation createGame($input: CreateGameInput) {
    createGame(input: $input) {
      ...gameFields
    }
  }
  ${gameFields}
`;

export const updateGameMutation = gql`
  mutation updateGame($id: ID!, $input: UpdateGameInput) {
    updateGame(id: $id, input: $input) {
      ...gameFields
    }
  }
  ${gameFields}
`;

export const updateGameStatusMutation = gql`
  mutation updateGameStatus($id: ID!, $gameStatus: Int) {
    updateGameStatus(id: $id, gameStatus: $gameStatus) {
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
  query gameMessages($gameId: ID!, $page: Int, $perPage: Int) {
    gameMessages(gameId: $gameId, page: $page, perPage: $perPage) {
      ...gameMessagesFields
    }
  }
  ${gameMessageFields}
`;

export const gameMessagesSummaryQuery = gql`
  query gameMessagesSummary($gameId: ID!) {
    gameMessagesSummary(gameId: $gameId) {
      countMessages
    }
  }
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
      updatedAt
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
      updatedAt
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
  query gameLoungeMessages($gameId: ID!, $page: Int, $perPage: Int) {
    gameLoungeMessages(gameId: $gameId, page: $page, perPage: $perPage) {
      ...gameLoungeMessagesFields
    }
  }
  ${gameLoungeMessageFields}
`;

export const gameLoungeMessagesSummaryQuery = gql`
  query gameLoungeMessagesSummary($gameId: ID!) {
    gameLoungeMessagesSummary(gameId: $gameId) {
      countMessages
    }
  }
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
      updatedAt
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
      updatedAt
    }
  }
`;
