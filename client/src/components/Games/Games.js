import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import CreateGame from './Create/CreateGame';
import ListGames from './List/ListGames';
import ViewGame from './View/ViewGame';

export default class Campaigns extends Component {

  render() {
    const {match} = this.props;

    return (
      <div className="games">
        <Switch>
          <Route exact path={`${match.url}/create`} component={CreateGame}/>
          <Route exact path={`${match.url}/:id`} component={ViewGame}/>
          <Route exact path={`${match.url}`} component={ListGames}/>
        </Switch>
      </div>
    )
  }
}

