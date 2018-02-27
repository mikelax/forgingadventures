import React, { Component } from 'react';
import { Helmet } from "react-helmet";

import GameDetailsForm from '../components/GameDetailsForm';

class CreateGame extends Component {

  render() {

    return (
      <React.Fragment>
        <Helmet>
          <title>Create new Game on Forging Adventures</title>
        </Helmet>

        <div className="CreateGame">
          <h1>Create a New Game</h1>

          <GameDetailsForm history={this.props.history} cancelFn={this._cancel} />
        </div>
      </React.Fragment>

    );
  };

  _cancel = () => {
    this.props.history.push('/games');
  };
};

export default CreateGame;
