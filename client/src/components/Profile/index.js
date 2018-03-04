// @flow

import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import { Card, Container, Header, Icon, Image, Label, Menu, Tab } from 'semantic-ui-react';

import GameCard from '../Games/components/GameCard';
import { myGamesQuery } from '../Games/queries';
import { meQuery } from '../../queries/users';

import './Profile.css';

class Profile extends Component {

  render() {
    const myGames = _.get(this.props, 'myGames.myGames');
    const user = _.get(this.props, 'me.me');

    const panes = this._getTabs(myGames);

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

  _getTabs(games) {
    return [
      { menuItem: <Menu.Item key='games'><Icon name='comments' />Games<Label>{_.size(games)}</Label></Menu.Item>,
        render: () => {
          return (
            <Tab.Pane>
              <Card.Group stackable={true} itemsPerRow={3}>
                {_.map(games, (game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </Card.Group>
            </Tab.Pane>
          );
        }
      },
      { menuItem: <Menu.Item key='invites'><Icon name='wait' />Pending Games<Label>0</Label></Menu.Item>,
        render: () => {
          return (
            <Tab.Pane>
              Games joined and waiting to be accepted.
              <br /> What is the best way to get a list of Games (with details) for games pending of status?
            </Tab.Pane>
          );
        }
      },
      { menuItem: <Menu.Item key='characters'><Icon name='users' />Characters<Label>0</Label></Menu.Item>,
        render: () => {
          return (
            <Tab.Pane>
              Character List
            </Tab.Pane>
          );
        }
      }
    ];
  }
}

export default compose(
  graphql(meQuery, { name: 'me' }),
  graphql(myGamesQuery, {
    name: 'myGames',
    options: ({ variables: { status: ['game-master', 'accepted'] } })
  })
)(Profile);
