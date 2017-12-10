import _ from 'lodash';
import React, { Component } from 'react';
import {Editor, EditorState, convertToRaw, convertFromRaw} from 'draft-js';

export default class GamesMessage extends Component {

  state = {
    editorState: EditorState.createEmpty()
  };

  clear() {
    this.setState({
      editorState: EditorState.createEmpty()
    });
  }

  componentWillMount() {
    const {message} = this.props;

    if (message) {
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(message))
      });
    }
  }

  // shouldComponentUpdate(nextProp) {
  //   return !(_.isEqual(this.props.message, nextProp.message));
  // }

  componentWillReceiveProps(nextProp) {
    if (nextProp.message) {
      const messageChanged = !(_.isEqual(this.props.message, nextProp.message));

      if (messageChanged) {
        this.setState({
          editorState: EditorState.createWithContent(convertFromRaw(nextProp.message))
        });
      }
    } else {
      this.setState({
        message: EditorState.createEmpty()
      });
    }
  }

  render() {
    return (
      <div className="editor-wrapper">
        <Editor editorState={this.state.editorState}
                onChange={this.onEditorChange}
                readOnly={this.props.readOnly}
        />
      </div>
    );
  }

  onEditorChange = (editorState) => {
    const {onChanged} = this.props;

    this.setState({editorState});

    if (onChanged) {
      onChanged({
        message: convertToRaw(this.state.editorState.getCurrentContent())
      });
    }
  };

};
