import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from "react-helmet";
import { compose, pure } from "recompose";
import { Grid, Header, Label, Menu } from 'semantic-ui-react';

import { gameQuery } from '../queries';
import GamePlayers from '../View/components/GamePlayers';

class EditGame extends Component {
  state = { activeItem: 'details' };

  _handleMenuClick = (e, { name }) => this.setState({ activeItem: name });

  _getActiveContent = () => {
    const { data: { game } } = this.props;
    let content;

    switch(this.state.activeItem) {
      case 'gameGM':
        content = <GamePlayers gameId={game.id} status={['game-master']} />;;
        break;
      case 'pendingPlayers':
        content = <GamePlayers gameId={game.id} status={['pending']} />;;
        break;
      case 'acceptedPlayers':
        content = <GamePlayers gameId={game.id} status={['accepted']} />;
        break;
      case 'details':
      default:
        content = (<div>
                Details content
              </div>);
        break;
    };

    return content;
  };

  render() {
    const { activeItem } = this.state;
    const title = _.get(this.props, 'data.game.title');

    const content = this._getActiveContent();

    return (
      <React.Fragment>
        <Helmet>
          <title>{`Editing ${title}`}</title>
        </Helmet>

        <div className="EditGame">
          <Header
            as='h1'
            content='Edit Game'
          />

          <Grid>
            <Grid.Column width={3}>
              <Menu fluid vertical tabular>
                <Menu.Item name='details' active={activeItem === 'details'} onClick={this._handleMenuClick} />
                <Menu.Item>
                  <Menu.Header>Players</Menu.Header>
                  <Menu.Menu>
                    <Menu.Item name='gameGM' active={activeItem === 'gameGM'} onClick={this._handleMenuClick}>
                      <Label>1</Label>
                      GM
                    </Menu.Item>
                    <Menu.Item name='acceptedPlayers' active={activeItem === 'acceptedPlayers'} onClick={this._handleMenuClick}>
                      <Label>4</Label>
                      Accepted
                    </Menu.Item>
                    <Menu.Item name='pendingPlayers' active={activeItem === 'pendingPlayers'} onClick={this._handleMenuClick}>
                      <Label>2</Label>
                      Pending
                    </Menu.Item>
                  </Menu.Menu>
                </Menu.Item>
              </Menu>
            </Grid.Column>

            <Grid.Column stretched width={13}>
              {content}
            </Grid.Column>
          </Grid>
        </div>
      </React.Fragment>
    );
  };
};

export default compose(
    graphql(gameQuery, {
      options: ( { match: { params: { id } } } ) => ({ variables: { id } })
    }),
    pure,
  )(EditGame);
