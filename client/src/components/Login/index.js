import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';

import {showLogin} from '../../services/login';

import './Login.styl';

class Login extends Component {

  static propTypes = {
    authorisation: PropTypes.shape({
      isAuthenticated: PropTypes.bool.isRequired
    }).isRequired
  };

  componentDidMount() {
    const {isAuthenticated} = this.props.authorisation;

    if (!(isAuthenticated)) {
      showLogin();
    }
  }

  render() {
    const {isAuthenticated} = this.props.authorisation;

    if (isAuthenticated) {
      return <Redirect to="/"/>;
    }

    return (
      <div className="Login">
        <div className="container">
          <h1>
            Login
          </h1>
          <p>This page uses custom Auth0 Lock widget, as opposed to hosted login page.
            <br/>If you remove the container attribute it will display as a modal.</p>

          <div id="auth0Lock"/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authorisation: state.authorisation,
});

export default connect(
  mapStateToProps
)(Login);
