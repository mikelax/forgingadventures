import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import CreateGame from './Create';
import ListGames from './List';
import ViewGame from './View';

import AuthGuard from '../shared/components/AuthGuard';

export default class Campaigns extends Component {

  render() {
    const {match} = this.props;

    return (
      <div className="games">
        <div className="container">
          <Switch>
            <Route exact path={`${match.url}/create`} component={AuthGuard(CreateGame)}/>
            <Route exact path={`${match.url}/:id`} component={ViewGame}/>
            <Route exact path={`${match.url}`} component={ListGames}/>
          </Switch>
        </div>
      </div>
    );
  }
}
