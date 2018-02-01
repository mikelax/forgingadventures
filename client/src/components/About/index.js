// @flow

import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import './About.styl';

export default class About extends Component<{||}> {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    return (
      <div className="About">
        <Container>
          <h1>
            About
          </h1>
        </Container>
      </div>
    );
  }
}
