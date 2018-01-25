// @flow

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {connect} from "react-redux";
import {Helmet} from "react-helmet";
import {Router, Route, Switch} from 'react-router-dom';

import About from '../About';
import AuthGuard from '../shared/components/AuthGuard';
import Callback from '../Callback';
import Header from '../Header';
import Home from '../Home';
import Login from '../Login';
import Profile from '../Profile';

import {processAuth} from '../../services/login';
import AlmostFinished from '../Login/AlmostFinished';
import Games from '../Games';
import history from '../../services/history';
import {authFailure, authSuccess} from '../../actions/auth';
import {getMyDetails} from '../../actions/me';


import './App.styl';

class App extends Component {

  static propTypes = {
    authFailure: PropTypes.func.isRequired,
    authSuccess: PropTypes.func.isRequired
  };

  componentWillMount() {
    const {authSuccess, authFailure, getMyDetails} = this.props;

    return processAuth()
      .then((token) => authSuccess(token))
      .tapCatch(e => authFailure(e))
      .then(() => getMyDetails());
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
              <Route path="/about" component={About} />
              <Route path="/profile" component={AuthGuard(Profile)} />
              <Route path="/login/almost-finished" component={AuthGuard(AlmostFinished)}/>
              <Route path="/login" component={Login} />
              <Route path="/callback" component={Callback} />
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
