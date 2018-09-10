import React from 'react';
import { Switch, Route } from 'react-router';

import AuthGuard from 'components/shared/AuthGuard';

import AlmostFinished from './AlmostFinished';
import Callback from './Callback';
import Login from './Login';

const LoginView = ({ match }) => (
  <div className="login">
    <Switch>
      <Route path={`${match.url}/callback`} component={Callback}/>
      <Route path={`${match.url}/almost-finished`} component={AuthGuard(AlmostFinished)}/>
      <Route exact path={`${match.url}/`} component={Login}/>
    </Switch>
  </div>
);

export default LoginView;
