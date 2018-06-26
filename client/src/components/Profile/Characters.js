import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { Card, Icon, Image, Tab } from 'semantic-ui-react';

import { myCharactersQuery } from 'components/Characters/queries';

export default function(props) {
  return (
    <Query query={myCharactersQuery}>
      {({ data, loading }) => (
        <Characters myCharacters={data.myCharacters} loading={loading} />
      )}
    </Query>
  );
}

function Characters(props) {
  const { myCharacters, loading } = props;

  return (
    <Tab.Pane loading={loading}>
      <Card.Group stackable={true} itemsPerRow={3}>
        {_.map(myCharacters, (character) => (
          <Card key={character.id} link>
            <Link to={`/characters/${character.id}/edit`}>
              <Image src={_.get(character, 'profileImage.url')}
                     label={{ as: 'a', color: 'red', content: character.label.shortName, ribbon: true }}
              />
            </Link>
            <Card.Content>
              <Card.Header>
                <Link to={`/characters/${character.id}/edit`}>{character.name}</Link>
              </Card.Header>
            </Card.Content>
            <Card.Content extra>
              <Icon name='comments' />
              {character.activeGamePlayer &&
              <Link to={`/games/${character.activeGamePlayer.game.id}`}>{character.activeGamePlayer.game.title}</Link>
              }
              {
                !character.activeGamePlayer &&
                'Not in Game'
              }
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </Tab.Pane>
  );
}
