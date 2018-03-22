import _ from 'lodash';
import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import logo from './logo.png';
import './Header.styl';

import { Container, Dropdown, Icon, Image, Menu, Responsive } from 'semantic-ui-react';

import { logout } from '../../actions/auth';

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
    this.setState({ visible: !this.state.visible });
  };

}

const LeftMenuItemsBase = ({ authorisation: { isAuthenticated } }) => {
  return (
    <React.Fragment>
      <Menu.Item as={NavLink} name="Home" exact to="/"/>
      <Menu.Item as={NavLink} name="About" to="/about"/>
      {
        isAuthenticated && <Menu.Item as={NavLink} name="Profile" to="/profile"/>
      }
      <Menu.Item as={NavLink} name="Games" to="/games"/>
    </React.Fragment>
  );
};

class RightMenuItemsBase extends Component {
  render() {
    const { authorisation: { isAuthenticated }, logout } = this.props;
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
            <Menu.Item as="a" name="Logout" onClick={logout}/>
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
    const userProfileImageUrl = _.get(me, 'profileImage.url');
    const username = _.get(me, 'username');

    if (userProfileImageUrl) {
      return (
        <span>
          <Image avatar src={userProfileImageUrl} /> {username}
        </span>
      );
    }
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

const mapStateToProps = state => ({
  authorisation: state.authorisation,
  me: state.me
});

const LeftMenuItems = connect(
  mapStateToProps, null, null, { pure: false }
)(LeftMenuItemsBase);

const RightMenuItems = connect(
  mapStateToProps,
  mapDispatchToProps, null, { pure: false }
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
