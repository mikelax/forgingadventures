import _ from 'lodash';
import React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { Header, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

export default function(objectOwnerKeyPath) {
  return compose(
    connect(
      ({ me }) => ({ me })
    ),
    withRouter,
    branch(
      (props) => {
        const ownerId = _.get(props, objectOwnerKeyPath);
        const currentUserId = _.get(props, 'me.me.id');

        // only return true when both ownerId and currentUserId are available and NOT equal
        // to render the left branch - otherwise fall through to the default render via the right branch
        return ownerId && currentUserId && (ownerId !== currentUserId);
      },
      renderComponent((props) => {
        const { history } = props;

        return (
          <div>
            <Header as='h1' icon textAlign='center'>
              <Icon name='lock' circular />
              <Header.Content>
                Not Authorized
                <Header.Subheader>
                  You are not able to access this page, please <a style={{ cursor: 'pointer' }} onClick={youShallNotPass}>click here to go back</a>.
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        );

        function youShallNotPass() {
          history.goBack();
        }
      })
    )
  );
}
