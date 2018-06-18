import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import CreateGame from './Create';
import ListGames from './List';
import ViewGame from './View';

import AuthGuard from 'components/shared/AuthGuard';

export default class Campaigns extends Component {

  render() {
    const { match } = this.props;

    return (
      <div className="games">
        <Container>
          <Switch>
            <Route path={`${match.url}/create`} component={AuthGuard(CreateGame)}/>
            <Route strict path={`${match.url}/`} component={ViewGame}/>
            <Route strict exact path={`${match.url}`} component={ListGames}/>
          </Switch>
        </Container>
      </div>
    );
  }
}
