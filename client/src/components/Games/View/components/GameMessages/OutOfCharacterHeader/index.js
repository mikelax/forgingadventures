import React from 'react';
import { Grid } from 'semantic-ui-react';

import { UserImageAvatar } from 'components/shared/ProfileImageAvatar';


export default function(props) {
  const { user } = props;

  return (
    <Grid.Row columns={2} className="message-header">
      <Grid.Column computer={2} tablet={3} mobile={4}
                   textAlign="center" verticalAlign="middle">
        <UserImageAvatar user={user}/>
      </Grid.Column>
      <Grid.Column computer={14} tablet={13} mobile={12}
                   className="user-name" verticalAlign="middle">
        {user.name}
      </Grid.Column>
    </Grid.Row>
  );
}
