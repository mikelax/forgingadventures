import _ from 'lodash';
import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {compose, pure} from "recompose";
import { gamePlayersQuery } from '../../queries';
import ApolloLoader from '../../../shared/components/ApolloLoader';

import './assets/GamePlayers.styl';

class GamePlayers extends Component {
  render() {
    const { data: { gamePlayers } } = this.props;

    return (
      <React.Fragment>
        <div className="GamePlayers">
          {_.map(gamePlayers, (player) => (
            <div key={player.id} className="game-player">
              <div className="user-image">
                {this._userProfileImage(player)}
                {player.user.name}
              </div>
              <div className="user-stats">
                {_.startCase(player.status)}
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }

  ////// private

  _userProfileImage = (player) => {
    const imageUrl = _.get(player, 'user.profileImage.url');

    if (imageUrl) {
      return <img src={imageUrl} alt=""/>;
    } else {
      return <span className="glyphicon glyphicon glyphicon-user" aria-hidden="true"/>;
    }
  };
}

export default compose(
  graphql(gamePlayersQuery, {
    options: ({ gameId }) => ({ variables: { gameId, status: ['game-master', 'pending', 'accepted'] } })
  }),
  ApolloLoader,
  pure,
)(GamePlayers);
