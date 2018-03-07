// @flow

import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import { Card, Container, Header, Icon, Image, Label, Menu, Tab } from 'semantic-ui-react';

import GameCard from '../Games/components/GameCard';
import { myGamesQuery } from '../Games/queries';
import { meQuery, myGamePlayersQuery } from '../../queries/users';

import './Profile.css';

class Profile extends Component {

  render() {
    const user = _.get(this.props, 'me.me');

    const panes = this._getTabs();

    if (user) {
      return (
      <React.Fragment>
        <Helmet>
          <title>{user.name} Profile on Forging Adventures</title>
        </Helmet>

        <Container>
          <Header as='h1'>
            <Image circular src={user.profileImage.url} />
            <Header.Content>
              {user.name}
              <Header.Subheader>
                {user.username}
                <br />{user.timezone}
              </Header.Subheader>
            </Header.Content>
          </Header>

          <Tab menu={{ pointing: true }} panes={panes}/>
        </Container>
      </React.Fragment>
      );
    } else {
      return null;
    }
  }

  _getTabs() {
    const myGamesProp = _.get(this.props, 'myGames');
    const myGamePlayersProp = _.get(this.props, 'myGamePlayers');

    const { loading: loadingGame, myGames } = myGamesProp;
    const { loading: loadingMyGamePlayers, myGamePlayers } = myGamePlayersProp;

    const gamesBreakdown = _.groupBy(myGamePlayers, 'status');
    const pendingGamesCount = _.get(gamesBreakdown, 'pending.length', 0);
    const quitGamesCount = _.get(gamesBreakdown, 'quit.length', 0);
    const rejectedGamesCount = _.get(gamesBreakdown, 'rejected.length', 0);
    const kickedGamesCount = _.get(gamesBreakdown, 'kicked.length', 0);

    return [
      { menuItem: <Menu.Item key='characters'><Icon name='users' />Characters<Label>0</Label></Menu.Item>,
        render: () => {
          return (
            <Tab.Pane>
              Character List
            </Tab.Pane>
          );
        }
      },
      { menuItem: <Menu.Item key='games'><Icon loading={loadingGame} name='comments' />Current Games<Label>{_.size(myGames)}</Label></Menu.Item>,
        render: () => <GamesByState status={['game-master', 'accepted']}/>
      },
      { menuItem: <Menu.Item key='pending'><Icon loading={loadingMyGamePlayers} name='wait' />Pending<Label>{pendingGamesCount}</Label></Menu.Item>,
        render: () => <GamesByState status={['pending']}/>
      },
      { menuItem: <Menu.Item key='quit'><Icon loading={loadingMyGamePlayers} name='hand paper' />Quit<Label>{quitGamesCount}</Label></Menu.Item>,
        render: () => <GamesByState status={['quit']}/>
      },
      { menuItem: <Menu.Item key='rejected'><Icon loading={loadingMyGamePlayers} name='thumbs outline down' />Rejected<Label>{rejectedGamesCount}</Label></Menu.Item>,
        render: () => <GamesByState status={['rejected']}/>
      },
      { menuItem: <Menu.Item key='kicked'><Icon loading={loadingMyGamePlayers} name='dont' />Kicked<Label>{kickedGamesCount}</Label></Menu.Item>,
        render: () => <GamesByState status={['rejected']}/>
      }
    ];
  }
}

function gamesByStatesBase(props) {
  const { status, myGames: myGamesProp } = props;
  const { myGames, loading } = myGamesProp;

  myGamesProp.refetch({
    status
  });

  return (
    <Tab.Pane loading={loading}>
      <Card.Group stackable={true} itemsPerRow={3}>
        {_.map(myGames, (game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </Card.Group>
    </Tab.Pane>
  );
}

const GamesByState = graphql(myGamesQuery, {
  name: 'myGames',
  options: ({ variables: { status: ['game-master', 'accepted'] } })
})(gamesByStatesBase);

export default compose(
  graphql(meQuery, { name: 'me' }),
  graphql(myGamesQuery, {
    name: 'myGames',
    options: ({ variables: { status: ['game-master', 'accepted'] } })
  }),
  graphql(myGamePlayersQuery, {
    name: 'myGamePlayers'
  })
)(Profile);
