import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import CreateGame from './Create';
import EditGame from './Edit';
import JoinGame from './View/Join';
import ListGames from './List';

import ViewGameDetails from './View/ViewGameDetails';
import ViewGameLoungeMessages from './View/ViewGameLoungeMessages';
import ViewGameMessages from './View/ViewGameMessages';

import AuthGuard from '../shared/components/AuthGuard';

import './View/assets/ViewGame.styl';


export default class Campaigns extends Component {

  render() {
    const { match } = this.props;

    return (
      <div className="games">
        <Container>
          <Switch>
            <Route path={`${match.url}/create`} component={AuthGuard(CreateGame)}/>
            <Route strict path={`${match.url}/`} component={ViewGamePaths}/>
            <Route strict exact path={`${match.url}`} component={ListGames}/>
          </Switch>
        </Container>
      </div>
    );
  }
}

function ViewGamePaths(props) {
  const { match } = props;

  return (
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
}
