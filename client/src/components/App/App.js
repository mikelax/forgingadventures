// @flow

import React, { Component } from 'react';
import { Router, Redirect, Route, Switch } from 'react-router-dom';

import Auth from '../../services/Auth/Auth.js';
import About from '../About/About';
import Callback from '../Callback/Callback';
import Home from '../Home/Home';
import Header from '../Header/Header';
import Login from '../Login/Login';
import Profile from '../Profile/Profile';

import Games from '../Games/Games';

import history from '../../services/Auth/history';

import './App.styl';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

class App extends Component<{}> {
  render() {
    return (
      <Router history={history}>
        <div>
          <Header auth={auth}/>
          <div className="App">
            <Switch>
              <Route exact path="/" render={(props) => <Home auth={auth} {...props} />} />
              <Route path="/about" component={About} />
              <Route path="/profile" render={(props) => (
                !auth.isAuthenticated() ? (
                  <Redirect to="/"/>
                ) : (
                  <Profile auth={auth} {...props} />
                )
              )}
              />
              <Route path="/login" component={Login} />
              <Route path="/callback" render={(props) => {
                handleAuthentication(props);
                return <Callback {...props} />;
              }}/>
              <Route path="/games" component={Games} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
