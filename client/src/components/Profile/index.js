// @flow

import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import { Card, Container, Header, Icon, Image, Label, Menu, Tab } from 'semantic-ui-react';

import GameCard from '../Games/components/GameCard';
import { myCharactersQuery } from '../Characters/queries';
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

          <Tab menu={{ pointing: true }} defaultActiveIndex='1' panes={panes}/>
        </Container>
      </React.Fragment>
      );
    } else {
      return null;
    }
  }

  _getTabs() {
    const { myCharacters: myCharactersProp, myGames: myGamesProp, myGamePlayers: myGamePlayersProp } = this.props;

    const { loading: loadingCharacter, myCharacters } = myCharactersProp;
    const { loading: loadingGame, myGames } = myGamesProp;
    const { loading: loadingMyGamePlayers, myGamePlayers } = myGamePlayersProp;

    const gamesBreakdown = _.groupBy(myGamePlayers, 'status');
    const pendingGamesCount = _.get(gamesBreakdown, 'pending.length', 0);
    const kickedGamesCount = _.get(gamesBreakdown, 'kicked.length', 0);

    return [
      { menuItem: <Menu.Item key='characters'><Icon name='users' />Characters<Label>{_.size(myCharacters)}</Label></Menu.Item>,
        render: () => <Characters loading={loadingCharacter} />
      },
      { menuItem: <Menu.Item key='games'><Icon loading={loadingGame} name='comments' />Current Games<Label>{_.size(myGames)}</Label></Menu.Item>,
        render: () => <GamesByState status={['game-master', 'accepted']}/>
      },
      { menuItem: <Menu.Item key='pending'><Icon loading={loadingMyGamePlayers} name='wait' />Pending Games<Label>{pendingGamesCount}</Label></Menu.Item>,
        render: () => <GamesByState status={['pending']}/>
      },
      { menuItem: <Menu.Item key='kicked'><Icon loading={loadingMyGamePlayers} name='dont' />Kicked<Label>{kickedGamesCount}</Label></Menu.Item>,
        render: () => <GamesByState status={['kicked']}/>
      }
    ];
  }
}

function charactersBase(props) {
  const { myCharacters: { myCharacters, loading } } = props;

  return (
    <Tab.Pane loading={loading}>
      <Card.Group stackable={true} itemsPerRow={3}>
        {_.map(myCharacters, (character) => (
          <Card key={character.id}>
            <Image src={_.get(character, 'profileImage.url')}
              label={{ as: 'a', color: 'red', content: character.label.shortName, ribbon: true }}
            />
            <Card.Content>
              <Card.Header>{character.name}</Card.Header>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </Tab.Pane>
  );
}

function gamesByStatesBase(props) {
  const { myGames: { myGames, loading } } = props;

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

const Characters = graphql(myCharactersQuery, {
  name: 'myCharacters'
})(charactersBase);

const GamesByState = graphql(myGamesQuery, {
  name: 'myGames',
  options: ( { status } ) => ({ variables: { status } })
})(gamesByStatesBase);

export default compose(
  graphql(myCharactersQuery, { name: 'myCharacters' }),
  graphql(meQuery, { name: 'me' }),
  graphql(myGamesQuery, {
    name: 'myGames',
    options: ({ variables: { status: ['game-master', 'accepted'] } })
  }),
  graphql(myGamePlayersQuery, {
    name: 'myGamePlayers'
  })
)(Profile);
