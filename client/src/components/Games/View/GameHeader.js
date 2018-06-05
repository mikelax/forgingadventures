import React from 'react';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import { Link, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Breadcrumb, Segment, Menu } from 'semantic-ui-react';

function GameHeader(props) {
  const { match, game } = props;

  return game
    ? (
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
            to={`/games/${match.params.id}`}
          >
            Game Details
          </Menu.Item>

          <Menu.Item
            name='gameLounge'
            as={NavLink}
            to={`/games/${match.params.id}/lounge`}
          >
            Game Lounge
          </Menu.Item>

          <Menu.Item
            name='gameMessages'
            as={NavLink}
            to={`/games/${match.params.id}/messages`}
          >
            Game Messages
          </Menu.Item>
        </Menu>
      </div>
    )
    : null;
}

export default compose(
  withRouter
)(GameHeader);
