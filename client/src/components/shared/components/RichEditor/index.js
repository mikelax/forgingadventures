import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CkEditor from '@ckeditor/ckeditor5-build-classic';

import './assets/GameLoungeMessage.styl';

export default class RichTextDisplay extends Component {

  static propTypes = {
    message: PropTypes.string,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func
  };

  state = {
    message: null
  };

  messageContent = null;

  componentWillMount() {
    const { message } = this.props;

    this.setState({ message });
  }

  componentWillReceiveProps(nextProp) {
    const { message } = nextProp;

    this.setState({ message });
  }

  render() {
    const { message, readOnly } = this.props;

    const displayComponent = readOnly ?
      <RenderMessage message={message} /> :
      <RichTextDisplayEditor ref={e => this.editor = e} message={message} onChange={this._handleOnChange} />;

    return (
      <div className="rich-text-display">
        {displayComponent}
      </div>
    );
  }

  clear() {
    this.editor.clear();
  }

  getEditorMessage() {
    return this.messageContent;
  }


  _handleOnChange = (meta) => {
    const { onChange } = this.props;

    if (_.isFunction(onChange)) {
      onChange({
        hasContent: meta.wordCount > 0
      });
    }

    this.messageContent = meta.content;
  }

}

function RenderMessage({ message }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: message }} />
  );
}

class RichTextDisplayEditor extends Component {

  static propTypes = {
    message: PropTypes.string,
    onChange: PropTypes.func
  };

  static blankMessage = '<p>&nbsp;</p>';

  componentDidMount() {
    return CkEditor
      .create(this.editorEl)
      .then(editor => (this.editor = editor))
      .then(() => {
        const { message } = this.props;

        if (message) {
          this.editor.setData(message);
        } else {
          this.clear();
        }
        // https://docs.ckeditor.com/ckeditor5/latest/api/module_engine_view_document-Document.html
        this.editor.document.on('change', () => this._handleOnChange());
      });
  }

  render() {
    return (
      <div className="rich-text-editor">
        <div ref={e => this.editorEl = e} />
      </div>
    );
  }

  clear() {
    this.editor.setData(RichTextDisplayEditor.blankMessage);
  }

  _handleOnChange = () => {
    const { onChange } = this.props;
    const content = this.editor.getData().replace('<p>&nbsp;</p>', '');

    onChange({
      content,
      wordCount: (content || '').length
    });
  }

}
