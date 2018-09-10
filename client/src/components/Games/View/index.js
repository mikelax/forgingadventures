import React from 'react';
import { Route, Switch } from 'react-router-dom';

import EditGame from '../Edit';
import JoinGame from './Join';

import ViewGameDetails from './ViewGameDetails';
import ViewGameLoungeMessages from './ViewGameLoungeMessages';
import ViewGameMessages from './ViewGameMessages';

import AuthGuard from 'components/shared/AuthGuard';

import './assets/ViewGame.styl';

const Game = ({ match }) => (
  <div className="ViewGame">
    <Switch>
      <Route path={`${match.url}:id/edit`} component={AuthGuard(EditGame)}/>
      <Route path={`${match.url}:id/lounge`} component={ViewGameLoungeMessages} />
      <Route path={`${match.url}:id/messages`} component={ViewGameMessages} />
      <Route path={`${match.url}:id/join`} component={AuthGuard(JoinGame)}/>
      <Route path={`${match.url}:id`} component={ViewGameDetails} />
    </Switch>
  </div>
);

export default Game;
