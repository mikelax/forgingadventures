import _ from 'lodash';
import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {compose, pure} from "recompose";
import { gamePlayersQuery } from '../../queries';
import ApolloLoader from '../../../shared/components/ApolloLoader';

class GamePlayers extends Component {
  render() {
    const { data: { gamePlayers } } = this.props;

    return (
      <React.Fragment>
        <div className="GamePlayers">
          {_.map(gamePlayers, (player) => (
            <div key={player.id}>
              {player.user.name} - {player.status}
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(gamePlayersQuery, {
    options: ({ gameId }) => ({ variables: { gameId, status: ['pending', 'accepted'] } })
  }),
  ApolloLoader,
  pure,
)(GamePlayers);
