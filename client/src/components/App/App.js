// @flow

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Router, Route, Switch } from 'react-router-dom';

import AuthGuard from '../shared/AuthGuard';
import Characters from '../Characters';
import Header from '../Header';
import Home from '../Home';
import Login from '../Login';
import Profile from '../Profile';
import Settings from '../Settings';

import { processAuth } from '../../services/login';
import Games from '../Games';
import history from '../../services/history';
import { authFailure, authSuccess } from '../../actions/auth';
import { getMyDetails } from '../../actions/me';

import './App.styl';

class App extends React.Component {

  static propTypes = {
    authFailure: PropTypes.func.isRequired,
    authSuccess: PropTypes.func.isRequired,
    getMyDetails: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { authSuccess, authFailure, getMyDetails } = this.props;

    return processAuth()
      .then((token) => authSuccess(token))
      .then(() => getMyDetails())
      .catch(e => authFailure(e));
  }

  render() {
    return (
      <Router history={history}>
        <div>
          <Helmet>
            <title>Forging Adventures</title>
          </Helmet>

          <Header/>

          <div className="App">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/characters" component={AuthGuard(Characters)} />
              <Route path="/profile" component={AuthGuard(Profile)} />
              <Route path="/settings" component={AuthGuard(Settings)} />
              <Route path="/login" component={Login} />
              <Route path="/games" component={Games} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  authSuccess: (token) => dispatch(authSuccess(token)),
  authFailure: (e) => dispatch(authFailure(e)),
  getMyDetails: () => dispatch(getMyDetails())
});

export default connect(
  null, //no mapStateToProps
  mapDispatchToProps,
)(App);
