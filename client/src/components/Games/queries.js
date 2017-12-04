import gql from 'graphql-tag';

export const gamesQuery = gql`
  query {
    games{
      id
      title
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

export const createGameMutation = gql`
  mutation createGame($input: CreateGameInput) {
    createGame(input: $input) {
      id
      title
    }
  }
`;