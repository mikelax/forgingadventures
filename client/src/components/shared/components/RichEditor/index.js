import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

import { uploadImage } from '../../../../services/image';

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
        hasContent: meta.wordCount > 0,
        content: meta.content
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

  render() {
    return (
      <Editor
        init={this._initEditor()}
        onEditorChange={this._handleOnChange}
      />
    );
  }

  clear() {
    this.editor.setContent('');
  }

  insertHtml(html) {
    this.editor.insertContent(html);
  }

  _handleOnChange = (content) => {
    const { onChange } = this.props;

    onChange({
      content,
      wordCount: (content || '').length
    });
  };

  _handleInit = (editor) => {
    const { message } = this.props;

    this.editor = editor;
    this.editor.setContent(message || '');
  };

  _initEditor = () => {
    return {
      menubar: false,
      branding: false,
      elementpath: false,
      theme: 'modern',
      init_instance_callback: this._handleInit,
      images_upload_handler: (blobInfo, success, failure) => {
        uploadImage(blobInfo.blob(), 'messageImage')
          .then((image) => {
            if (image) {
              success(image.imageUrl);
            }
          })
          .catch(failure);
      },
      block_formats: 'Paragraph=p;Header 2=h2;Header 3=h3',
      plugins: [
        'link image lists colorpicker',
        'fullscreen media imagetools',
        'directionality textcolor textcolor colorpicker textpattern'
      ],
      toolbar: 'bold italic underline | alignleft aligncenter alignright | formatselect | bullist numlist | outdent indent blockquote forecolor backcolor | undo redo | image',
      content_css: [
        `${window.PUBLIC_URL}/editor.css`
      ]
    };
  }

}
