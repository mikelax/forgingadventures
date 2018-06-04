import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import CreateGame from './Create';
import EditGame from './Edit';
import JoinGame from './View/Join';
import ListGames from './List';

import GameHeader from './View/GameHeader';
import ViewGameDetails from './View/ViewGameDetails';
import ViewGameLoungeMessages from './View/ViewGameLoungeMessages';
import ViewGameMessages from './View/ViewGameMessages';

import AuthGuard from '../shared/components/AuthGuard';

export default class Campaigns extends Component {

  render() {
    const { match } = this.props;

    return (
      <div className="games">
        <Container>
          <Route exact path={`${match.url}`} component={ListGames}/>

          <Route path={`${match.url}/create`} component={AuthGuard(CreateGame)}/>

          <div className="ViewGame">
            <Route path={`${match.url}/:id`} component={GameHeader}/>
            <Route exact path={`${match.url}/:id`} component={ViewGameDetails} />
            <Route path={`${match.url}/:id/edit`} component={AuthGuard(EditGame)}/>
            <Route path={`${match.url}/:id/lounge`} component={ViewGameLoungeMessages} />
            <Route path={`${match.url}/:id/messages`} component={ViewGameMessages} />
            <Route path={`${match.url}/:id/join`} component={AuthGuard(JoinGame)}/>
          </div>

        </Container>
      </div>
    );
  }
}
