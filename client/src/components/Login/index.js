import React, { Component } from 'react';
import { Switch, Route } from 'react-router';

import AlmostFinished from './AlmostFinished';
import AuthGuard from '../shared/components/AuthGuard';
import Callback from './Callback';
import Login from './Login';

export default class LoginView extends Component {

  render() {
    const { match } = this.props;

    return (
      <div className="login">
        <Switch>
          <Route path={`${match.url}/callback`} component={Callback}/>
          <Route path={`${match.url}/almost-finished`} component={AuthGuard(AlmostFinished)}/>
          <Route exact path={`${match.url}/`} component={Login}/>
        </Switch>
      </div>
    );
  }
}
