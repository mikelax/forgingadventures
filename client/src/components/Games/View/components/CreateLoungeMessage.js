import React, { Component } from 'react';
import _ from 'lodash';
import { graphql } from 'react-apollo';
import { Form, Button } from 'semantic-ui-react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import RichEditor from 'components/shared/RichEditor';

import { createGameLoungeMessageMutation } from '../../queries';

class CreateGameLoungeMessage extends Component {

  state = {
    hasContent: false
  };

  editor = React.createRef();

  // need UNSAFE_componentWillReceiveProps otherwise timing on quoting blocks breaks

  UNSAFE_componentWillReceiveProps(nextProps) {
    const loungeMessage = _.get(nextProps, 'loungeMessage.message');

    if (loungeMessage) {
      this.editor.current.addQuoteBlock(loungeMessage);
    }
  }

  render() {
    return (
      <div className="create-message">
        <Form>
          <Form.Field>
            <label>Add Message</label>
            <RichEditor ref={this.editor} onChange={this._handleOnChange}/>
          </Form.Field>

          <Button primary onClick={this._submit} disabled={!(this.state.hasContent)}>Submit</Button>
        </Form>

      </div>
    );
  }

  _handleOnChange = (data) => {
    if (data.hasContent !== this.state.hasContent) {
      this.setState({ hasContent: data.hasContent });
    }
  };

  _submit = () => {
    const { mutate } = this.props;
    const { hasContent } = this.state;

    hasContent && mutate({
      variables: {
        input: {
          gameId: this.props.gameId,
          message: this.editor.current.getEditorMessage()
        }
      }
    })
      .then(() => {
        this.editor.current.clear();
      });
  };
}

export default compose(
  graphql(createGameLoungeMessageMutation),
  connect(
    (state) => ({ loungeMessage: state.loungeMessage })
  )
)(CreateGameLoungeMessage);
