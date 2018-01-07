// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Redirect, Route, Switch } from 'react-router-dom';
import {connect} from "react-redux";

import About from '../About/About';
import Home from '../Home/Home';
import Header from '../Header/Header';
import Login from '../Login/Login';
import Profile from '../Profile/Profile';

import {processAuth} from '../../services/login';
import Games from '../Games';
import history from '../../services/Auth/history';
import {authFailure, authSuccess} from "../../actions/auth";

import './App.styl';

class App extends Component {

  static propTypes = {
    authFailure: PropTypes.func.isRequired,
    authSuccess: PropTypes.func.isRequired
  };

  componentWillMount() {
    const {authSuccess, authFailure} = this.props;

    processAuth()
      .then((token) => {
        authSuccess(token);
      })
      .catch(e => authFailure(e));
  }

  render() {
    const {isAuthenticated} = this.props.authorisation;

    return (
      <Router history={history}>
        <div>
          <Header/>
          <div className="App">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/profile" render={(props) => (
                !isAuthenticated ? (
                  <Redirect to="/"/>
                ) : (
                  <Profile/>
                )
              )}
              />
              <Route path="/login" component={Login} />
              <Route path="/games" component={Games} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  authorisation: state.authorisation,
});

const mapDispatchToProps = dispatch => ({
  authSuccess: (token) => dispatch(authSuccess(token)),
  authFailure: (e) => dispatch(authFailure(e))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
