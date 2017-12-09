import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, ControlLabel, FormGroup } from 'react-bootstrap';
import {Editor, EditorState, convertToRaw} from 'draft-js';

import { createGameMessageMutation } from '../queries';

const CreateGame = class CreateGame extends Component {

  state = {
    editorState: EditorState.createEmpty()
  };

  render() {
    return (
      <div className="create-message">
        <form>
          <FormGroup>
            <ControlLabel>Add Message</ControlLabel>
            <div className="editor-wrapper">
              <Editor editorState={this.state.editorState} onChange={this.onEditorChange} />
            </div>
          </FormGroup>
        </form>

        <Button bsStyle="primary" onClick={this.submit}>Submit</Button>
      </div>
    );
  }

  onEditorChange = (editorState) => this.setState({editorState});

  submit = () => {
    console.log('this.state.editorState', this.state.editorState)
    this.props
      .mutate({
        variables: {
          input: {
            gameId: this.props.gameId,
            message: convertToRaw(this.state.editorState.getCurrentContent())
          }
        }
      })
      .then(() => this.setState({ editorState: EditorState.createEmpty() }));
  }
};

export default graphql(createGameMessageMutation)(CreateGame);