import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import CreateGame from './Create';
import EditGame from './Edit';
import JoinGame from './View/Join';
import ListGames from './List';
import ViewGame from './View';

import AuthGuard from '../shared/components/AuthGuard';
import EditGameGuard from '../shared/components/EditGameGuard';

export default class Campaigns extends Component {

  render() {
    const { match } = this.props;

    return (
      <div className="games">
        <Container>
          <Switch>
            <Route exact path={`${match.url}/create`} component={AuthGuard(CreateGame)}/>
            <Route exact path={`${match.url}/:id/join`} component={AuthGuard(JoinGame)}/>
            <Route exact path={`${match.url}/:id/edit`} component={EditGameGuard(AuthGuard(EditGame))}/>
            <Route exact path={`${match.url}/:id`} component={ViewGame}/>
            <Route exact path={`${match.url}`} component={ListGames}/>
          </Switch>
        </Container>
      </div>
    );
  }
}
