import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';

import { postingFrequency, skillLevel } from '../../utils/gameSettings';
import dragons from './dragons.jpg';
import './gameCard.styl';

export default class GameCard extends Component {

  static propTypes = {
    game: PropTypes.object.isRequired
  };

  render() {
    const { game } = this.props;
    const { label: { shortName } } = game;
    const imageSrc = _.get(game, 'gameImage.url') || dragons;

    return (
      <Card className="game-card-component">
        <Image src={imageSrc}
               label={{ as: 'a', color: 'red', content: shortName, ribbon: true }}
        />
        <Card.Content>
          <Card.Header>
            <Link to={`/games/${game.id}`}>{game.title}</Link>
          </Card.Header>
          <Card.Meta>
            {game.scenario}
          </Card.Meta>
          <Card.Description>
            <div className="truncated" dangerouslySetInnerHTML={{ __html: game.overview }} />
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div>
            <Icon name='group'/>
            {game.gameSettings.minPlayers} to {game.gameSettings.maxPlayers} players
          </div>
          <div>
            <Icon name='student'/>
            {skillLevel(game.gameSettings.skillLevel)}
          </div>
          <div>
            <Icon name='clock'/>
            {postingFrequency(game.gameSettings.postingFrequency)}
          </div>
        </Card.Content>
      </Card>
    );
  };
}
