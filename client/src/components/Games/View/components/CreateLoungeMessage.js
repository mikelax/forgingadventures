import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Form, Button } from 'semantic-ui-react';

import RichEditor from '../../../shared/components/RichEditor';

import { createGameLoungeMessageMutation } from '../../queries';

class CreateGameLoungeMessage extends Component {

  state = {
    hasContent: false
  };

  render() {
    return (
      <div className="create-message">
        <Form>
          <Form.Field>
            <label>Add Message</label>
            <RichEditor ref={(c) => (this.editor = c)} onChange={this._handleOnChange}/>
          </Form.Field>

          <Button primary onClick={this._submit} disabled={!(this.state.hasContent)}>Submit</Button>
        </Form>

      </div>
    );
  }

  _handleOnChange = (data) => {
    this.setState({ hasContent: data.hasContent });
  };

  _submit = () => {
    const { mutate } = this.props;
    const { hasContent } = this.state;

    hasContent && mutate({
      variables: {
        input: {
          gameId: this.props.gameId,
          message: this.editor.getEditorMessage()
        }
      }
    })
      .then(() => {
        this.editor.clear();
      });
  };
}

export default graphql(createGameLoungeMessageMutation)(CreateGameLoungeMessage);
