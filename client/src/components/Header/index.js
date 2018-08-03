import _ from 'lodash';
import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Dropdown, Icon, Image, Menu, Responsive } from 'semantic-ui-react';

import { UserImageAvatar } from 'components/shared/ProfileImageAvatar';
import { authLogout } from 'services/login';

import logo from './logo.png';
import './Header.styl';



const NavBarDesktop = () => (
    <Menu inverted>
      <Menu.Item>
        <Link to="/">
          <Image size="mini" src={logo}/>
        </Link>
      </Menu.Item>

      <LeftMenuItems/>
      <Menu.Menu position="right">
        <RightMenuItems/>
      </Menu.Menu>
    </Menu>
  )
;

class NavBarMobile extends Component {
  state = {
    visible: false
  };

  render() {
    const { visible } = this.state;

    return (
      <React.Fragment>
        <Menu inverted>
          <Menu.Item>
            <Link to="/">
              <Image size="mini" src={logo}/>
            </Link>
          </Menu.Item>

          <Menu.Menu position="right">
            <Menu.Item onClick={this._toggleMenu}>
              <Icon name="bars"/>
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        {
          visible && (
            <Menu inverted vertical fluid>
              <LeftMenuItems/>
              <RightMenuItems/>
            </Menu>
          )
        }

      </React.Fragment>

    );
  }

  _toggleMenu = () => {
    this.setState(prevState => ({ visible: !prevState.visible }));
  };

}

const LeftMenuItemsBase = ({ authorisation: { isAuthenticated } }) => {
  return (
    <React.Fragment>
      <Menu.Item as={NavLink} name="Home" exact to="/"/>
      {
        isAuthenticated && <Menu.Item as={NavLink} name="Profile" to="/profile"/>
      }
      <Menu.Item as={NavLink} name="Games" to="/games"/>
    </React.Fragment>
  );
};

class RightMenuItemsBase extends Component {
  render() {
    const { authorisation: { isAuthenticated } } = this.props;
    const meLoading = _.get(this.props, 'me.loading');

    const createNewMenu = (
      <Menu.Item>
        <Dropdown icon='add'>
          <Dropdown.Menu>
            <Menu.Item as={NavLink} name="New Character" icon='users' to="/characters/create" />
            <Menu.Item as={NavLink} name="New Game" icon='comments' to="/games/create" />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
    );

    const loggedInMenu = (
      <Menu.Item>
        <Dropdown trigger={this._userLogo()} loading={meLoading}>
          <Dropdown.Menu>
            <Menu.Item as={NavLink} name="Profile" to="/profile"/>
            <Menu.Item as={NavLink} name="Settings" to="/settings"/>
            <Dropdown.Divider />
            <Menu.Item as="a" name="Logout" onClick={authLogout}/>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
    );

    return (
      <React.Fragment>
        {
          !(isAuthenticated) && <Menu.Item as={Link} name="Login" to="/login"/>
        }
        {
          isAuthenticated && createNewMenu
        }
        {
          isAuthenticated && loggedInMenu
        }
      </React.Fragment>
    );
  }

  _userLogo() {
    const { me: { me } } = this.props;
    const username = _.get(me, 'username');

    return me && (
      <span>
        <UserImageAvatar user={me} size="mini"/>
        {username}
      </span>
    );
  }
}

const mapStateToProps = state => ({
  authorisation: state.authorisation,
  me: state.me
});

const LeftMenuItems = connect(
  mapStateToProps, null, null, { pure: false }
)(LeftMenuItemsBase);

const RightMenuItems = connect(
  mapStateToProps, null, null, { pure: false }
)(RightMenuItemsBase);

export default class Header extends Component {
  render() {
    return (
      <div className="navbar">
        <Container>
          <Responsive {...Responsive.onlyMobile}>
            <NavBarMobile/>
          </Responsive>

          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            <NavBarDesktop/>
          </Responsive>
        </Container>
      </div>
    );
  }
}
