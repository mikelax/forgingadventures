import React, { Component } from 'react';
import {Button, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';

export default class GameMessage extends Component {

  render() {
    return <div className="GameSearch">
      <FormGroup className="options">
        <FormControl
          type="text"
          value={this.formValue('title')}
          placeholder="Enter Campaign Name"
          onChange={this.formInput('title')}
        />
      </FormGroup>

    </div>;
  }

}

///// private

