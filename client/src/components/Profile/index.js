// @flow

import _ from 'lodash';
import React, { Component } from 'react';
import { graphql, Query } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { compose } from 'recompose';
import { Container, Header, Icon, Label, Menu } from 'semantic-ui-react';
import { Route, Switch } from 'react-router-dom';

import Games from './Games';
import Characters from './Characters';
import PendingGames from './PendingGames';
import KickedGames from './KickedGames';

import { myCharactersSummaryQuery } from 'components/Characters/queries';
import { myGamesSummaryQuery } from 'components/Games/queries';
import { UserImageAvatar } from 'components/shared/ProfileImageAvatar';

import { meQuery } from 'queries/users';

import './Profile.css';

class Profile extends Component {

  render() {
    const { match } = this.props;
    const user = _.get(this.props, 'me.me');

    if (user) {
      return (
        <React.Fragment>
          <Helmet>
            <title>{user.name} Profile on Forging Adventures</title>
          </Helmet>

          <Container>
            <Header as='h1'>
              <UserImageAvatar user={user} />
              <Header.Content>
                {user.name}
                <Header.Subheader>
                  {user.username}
                  <br />{user.timezone}
                </Header.Subheader>
              </Header.Content>
            </Header>

            <Query query={myGamesSummaryQuery}>
              {({ data: dataGamesSummary, loading: loadingSummary }) => (
                <Query query={myCharactersSummaryQuery}>
                  {({ data: dataCharacters, loading: loadingCharacters }) => (
                    <ProfileHeader
                      match={match}
                      user={user}
                      loadingSummary={loadingSummary}
                      loadingCharacters={loadingCharacters}
                      dataCharacters={dataCharacters.myCharactersSummary}
                      dataGamesSummary={dataGamesSummary.myGamesSummary}
                    />
                  )}
                </Query>
              )}
            </Query>

            <Switch>
              <Route exact path={match.url} component={Games} />
              <Route path={`${match.url}/characters`} component={Characters} />
              <Route path={`${match.url}/pending-games`} component={PendingGames} />
              <Route path={`${match.url}/kicked-games`} component={KickedGames} />
            </Switch>

          </Container>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

}

function ProfileHeader(props) {
  const { match } = props;
  const { dataGamesSummary, loadingSummary, loadingCharacters } = props;

  const charactersCount = _.get(props, 'dataCharacters.charactersCount');
  const pendingGamesCount = _.find(dataGamesSummary, { status: 'pending' });
  const kickedGamesCount = _.find(dataGamesSummary, { status: 'kicked' });

  const activeGamesCount = _.chain(dataGamesSummary)
    .filter(({ status }) => _.includes(['accepted', 'game-master'], status))
    .map('statusCount')
    .sum()
    .value();

  return (
    <div className="user-profile-header">
      <Menu pointing style={{ marginBottom: '16px' }}>
        <Menu.Item
          as={NavLink}
          to={`${match.url}/characters`}
        >
          <Icon name='users' loading={loadingCharacters} />
          Characters
          <Label>
            {charactersCount}
          </Label>
        </Menu.Item>

        <Menu.Item
          as={NavLink}
          to={`${match.url}`}
          exact
        >
          <Icon name='comments' loading={loadingSummary} />
          Current Games
          <Label>
            {activeGamesCount}
          </Label>
        </Menu.Item>

        <Menu.Item
          as={NavLink}
          to={`${match.url}/pending-games`}
        >
          <Icon name='wait' loading={loadingSummary} />
          Pending Games
          <Label>
            {_.get(pendingGamesCount, 'statusCount', 0)}
          </Label>
        </Menu.Item>

        <Menu.Item
          as={NavLink}
          to={`${match.url}/kicked-games`}
        >
          <Icon name='dont' loading={loadingSummary} />
          Kicked
          <Label>
            {_.get(kickedGamesCount, 'statusCount', 0)}
          </Label>
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default compose(
  graphql(meQuery, { name: 'me' }),
)(Profile);
