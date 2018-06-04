import React from 'react';
import { Helmet } from 'react-helmet';
import { compose, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { Link, NavLink } from 'react-router-dom';
import { Breadcrumb, Segment, Menu } from 'semantic-ui-react';

import ApolloLoader from 'components/shared/components/ApolloLoader';

import { gameQuery } from '../queries';

import './assets/ViewGame.styl';


function GameHeader(props) {
  const { match, data: { game } } = props;

  return (
    <div className="ViewGame">
      <Helmet>
        <title>{game.title} on Forging Adventures</title>
      </Helmet>

      <Segment>
        <Breadcrumb>
          <Breadcrumb.Section as={Link} to="/">Home</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron'/>
          <Breadcrumb.Section as={Link} to="/games">Games</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron'/>
          <Breadcrumb.Section active>{game.title}</Breadcrumb.Section>
        </Breadcrumb>
      </Segment>

      <Menu>
        <Menu.Item
          name='gameDetails'
          as={NavLink}
          exact
          to={match.url}
        >
          Game Details
        </Menu.Item>

        <Menu.Item
          name='gameLounge'
          as={NavLink}
          to={`${match.url}/lounge`}
        >
          Game Lounge
        </Menu.Item>

        <Menu.Item
          name='gameMessages'
          as={NavLink}
          to={`${match.url}/messages`}
        >
          Game Messages
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default compose(
  graphql(gameQuery, {
    options: ({ match: { params: { id } } }) => ({ variables: { id } })
  }),
  ApolloLoader,
  pure,
)(GameHeader);
