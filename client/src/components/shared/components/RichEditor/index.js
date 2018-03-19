import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

import './assets/RichEditor.styl';

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

  addQuoteBlock(messageObject, messageKey = 'message') {
    const content = messageObject[messageKey];
    const quote = `<blockquote>${content}</blockquote>`;

    this.editor.insertHtml(quote);
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

  render() {
    const { message } = this.props;

    return (
      <Editor
        init={{
          menubar: false,
          branding: false,    
          elementpath: false,
          theme: 'modern',
          inline:true,
          height: 150,
          autofocus: true,
          init_instance_callback: this._handleInit,
          setup: (editor) => {
            // This prevents the blur event from hiding the toolbar
            editor.on('blur',() => false);
          }
        }}
        value={message}
        onEditorChange={this._handleOnChange}
      />
    );
  }

  clear() {
    this.editor.setContent('');
  }

  insertHtml(html) {
    this.editor.insertContent(html);
    // this.editorEl.focus();

    // setTimeout(() => {
    // const { CKEDITOR } = window;
    // const el = CKEDITOR.dom.element.createFromHtml(html);

    // this.editor.insertElement(el);
    // }, 100);
  }

  _handleOnChange = (content) => {
    console.log('content', content);
    const { onChange } = this.props;

    onChange({
      content,
      wordCount: (content || '').length
    });
  }

  _handleInit = (editor) => {
    this.editor = editor;
    this.editor.focus();
  }

}
