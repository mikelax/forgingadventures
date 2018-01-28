import _ from "lodash";
import React, { Component } from "react";
import {Link} from 'react-router-dom';
//import { render } from "react-dom";
import {
  Container,
  Icon,
  Image,
  Menu,
  Sidebar,
  Responsive
} from "semantic-ui-react";

const NavBarMobile = ({
  children,
  leftItems,
  onPusherClick,
  onToggle,
  rightItems,
  visible
}) => (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        items={leftItems}
        vertical
        visible={visible}
      />
      <Sidebar.Pusher
        dimmed={visible}
        onClick={onPusherClick}
        style={{ minHeight: "100vh" }}
      >
        <Menu fixed="top" inverted>
          <Menu.Item>
            <Image size="mini" src='https://s3.amazonaws.com/forgingadventures-resources/auth0/fa_anvil_rust_logo.png' />
          </Menu.Item>
          <Menu.Item onClick={onToggle}>
            <Icon name="sidebar" />
          </Menu.Item>
          <Menu.Menu position="right">
            {_.map(rightItems, item => <Menu.Item {...item} />)}
          </Menu.Menu>
        </Menu>
        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );

const NavBarDesktop = ({ leftItems, rightItems }) => (
  <Menu fixed="top" inverted fluid>
    <Container>
      <Menu.Item>
        <Link to="/">
          <Image size="mini" src='https://s3.amazonaws.com/forgingadventures-resources/auth0/fa_anvil_rust_logo.png' />
        </Link>
      </Menu.Item>
      {_.map(leftItems, item => <Menu.Item {...item} />)}
      <Menu.Menu position="right">
        {_.map(rightItems, item => <Menu.Item {...item} />)}
      </Menu.Menu>
    </Container>
  </Menu>
);


const NavBarChildren = ({ children }) => (
  <Container style={{ marginTop: "5em" }}>{children}</Container>
);

class NavBar extends Component {
  state = {
    visible: false
  };

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    const { children, leftItems, rightItems } = this.props;
    const { visible } = this.state;

    return (
      <div>
        <Responsive {...Responsive.onlyMobile}>
          <NavBarMobile
            leftItems={leftItems}
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            rightItems={rightItems}
            visible={visible}
          >
            <NavBarChildren>{children}</NavBarChildren>
          </NavBarMobile>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavBarDesktop leftItems={leftItems} rightItems={rightItems} />
          <NavBarChildren>{children}</NavBarChildren>
        </Responsive>
      </div>
    );
  }
}

const leftItems = [
  { as: "a", content: "Games", key: "games", href: "/games" }
];
const rightItems = [
  { as: "a", content: "Login", key: "login" }
];

export default class Header extends Component {
  render() {
    return (
      <NavBar leftItems={leftItems} rightItems={rightItems} />
    );
  }
}

//render(<App />, document.getElementById("root"));


// import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import {Button, Nav, Navbar, NavItem} from 'react-bootstrap';
// import {Link} from 'react-router-dom';

// import {logout} from '../../actions/auth';

// const Header = class extends Component {

//   static propTypes = {
//     authorisation: PropTypes.shape({
//       isAuthenticated: PropTypes.bool.isRequired,
//       loading: PropTypes.bool,
//       error: PropTypes.object,
//     }).isRequired
//   };

//   render() {
//     const {isAuthenticated} = this.props.authorisation;

//     // https://github.com/react-bootstrap/react-router-bootstrap
//     // https://reacttraining.com/react-router/web/api/NavLink
//     // https://auth0.com/docs/quickstart/spa/react
//     return (
//       <div>
//         <Navbar inverse fixedTop>
//           <Navbar.Header>
//             <Navbar.Brand><Link to="/">Home</Link></Navbar.Brand>
//             <Navbar.Toggle/>
//           </Navbar.Header>
//           <Navbar.Collapse>
//             <Nav>
//               <NavItem href="/about">About</NavItem>
//               {isAuthenticated && (
//                 <NavItem href="/profile">Profile</NavItem>
//               )}
//               <NavItem href="/games">Games</NavItem>
//             </Nav>
//             <Nav pullRight>
//               {
//                 !isAuthenticated && (
//                   <NavItem href="/login">Login</NavItem>
//                 )
//               }
//               {
//                 isAuthenticated && (
//                   <NavItem><Button
//                     bsStyle="primary"
//                     bsSize="xsmall"
//                     className="btn-margin"
//                     onClick={this.logout}
//                   >
//                     Log Out
//                   </Button></NavItem>
//                 )
//               }
//             </Nav>
//           </Navbar.Collapse>
//         </Navbar>
//       </div>
//     );
//   }

//   logout = () => {
//     this.props.logout();
//   };

// };

// const mapStateToProps = state => ({
//   authorisation: state.authorisation,
// });

// const mapDispatchToProps = dispatch => ({
//   logout: () => dispatch(logout())
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(Header);
