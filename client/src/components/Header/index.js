import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Button, Nav, Navbar, NavItem} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import {logout} from '../../actions/auth';

const Header = class extends Component {

  static propTypes = {
    authorisation: PropTypes.shape({
      isAuthenticated: PropTypes.bool.isRequired,
      loading: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired
  };

  render() {
    const {isAuthenticated} = this.props.authorisation;

    // https://github.com/react-bootstrap/react-router-bootstrap
    // https://reacttraining.com/react-router/web/api/NavLink
    // https://auth0.com/docs/quickstart/spa/react
    return (
      <div>
        <Navbar inverse fixedTop>
          <Navbar.Header>
            <Navbar.Brand><Link to="/">Home</Link></Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem href="/about">About</NavItem>
              {isAuthenticated && (
                <NavItem href="/profile">Profile</NavItem>
              )}
              <NavItem href="/games">Games</NavItem>
            </Nav>
            <Nav pullRight>
              {
                !isAuthenticated && (
                  <NavItem href="/login">Login</NavItem>
                )
              }
              {
                isAuthenticated && (
                  <NavItem><Button
                    bsStyle="primary"
                    bsSize="xsmall"
                    className="btn-margin"
                    onClick={this.logout}
                  >
                    Log Out
                  </Button></NavItem>
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }

  logout = () => {
    this.props.logout();
  };

};

const mapStateToProps = state => ({
  authorisation: state.authorisation,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
