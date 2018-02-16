import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';

import { showLogin } from '../../../services/login';

import './Login.styl';

class Login extends Component {

  static propTypes = {
    authorisation: PropTypes.shape({
      isAuthenticated: PropTypes.bool.isRequired
    }).isRequired
  };

  componentDidMount() {
    const { isAuthenticated } = this.props.authorisation;

    if (!(isAuthenticated)) {
      showLogin();
    }
  }

  render() {
    const { isAuthenticated } = this.props.authorisation;

    if (isAuthenticated) {
      return <Redirect to="/"/>;
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Log in or Sign up to Forging Adventures</title>
        </Helmet>

        <div className="Login">
          <Container>
            <Header as="h1">
              Log In
            </Header>

            <div id="auth0Lock"/>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  authorisation: state.authorisation
});

export default connect(
  mapStateToProps
)(Login);
