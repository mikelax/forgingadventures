import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import CreateCharacter from './Create';
import EditCharacter from './Edit';

import AuthGuard from 'components/shared/AuthGuard';

const Characters = ({ match }) => (
  <div className="characters">
    <Container>
      <Switch>
        <Route exact path={`${match.url}/create`} component={AuthGuard(CreateCharacter)}/>
        <Route exact path={`${match.url}/:id/edit`} component={AuthGuard(EditCharacter)}/>
      </Switch>
    </Container>
  </div>
);

export default Characters;
