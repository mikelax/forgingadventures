import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import './Home.styl';

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <Container>
          <header className="App-header">
            <h1 className="App-title">Welcome to the Homepage</h1>
          </header>
        </Container>
      </div>
    );
  }
}
