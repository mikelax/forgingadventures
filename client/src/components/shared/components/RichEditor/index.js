import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

import { uploadImage } from '../../../../services/image';

import './assets/RichEditor.styl';

export default class RichTextDisplay extends Component {

  static propTypes = {
    customButtons: PropTypes.array,
    message: PropTypes.string,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func
  };

  state = {
    message: null
  };

  editor = React.createRef();

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
    const { message, customButtons, readOnly } = this.props;

    const displayComponent = readOnly
      ? <RenderMessage message={message}/>
      : <RichTextDisplayEditor
        ref={this.editor}
        message={message}
        customButtons={customButtons}
        onChange={this._handleOnChange}
      />;

    return (
      <div className="rich-text-display">
        {displayComponent}
      </div>
    );
  }

  clear() {
    this.editor.current.clear();
  }

  getEditorMessage() {
    return this.messageContent;
  }

  addQuoteBlock(messageObject, messageKey = 'message') {
    const content = messageObject[messageKey];
    const quote = `<blockquote>${content}</blockquote>`;

    this.editor.current.insertHtml(quote);
    setTimeout(() => this.editor.current.insertCursorPlaceholderAtEnd());
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
  };

}

function RenderMessage({ message }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: message }}/>
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

  insertCursorPlaceholderAtEnd() {
    //add an empty span with a unique id
    const spanId = _.uniqueId('editorEndPlaceholder');
    this.editor.dom.add(this.editor.getBody(), 'p', { 'id': spanId }, '&nbsp;');

    //select that span
    const newNode = this.editor.dom.select('p#' + spanId);
    this.editor.selection.select(newNode[0]);
    this.editor.selection.collapse(true);
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
    const { customButtons } = this.props;

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
      toolbar: 'bold italic underline | alignleft aligncenter alignright | formatselect | bullist numlist | outdent indent blockquote forecolor backcolor | undo redo | image | custombuttons',
      content_css: [
        `${window.PUBLIC_URL}/editor.css`
      ],
      setup: (editor) => {
        _.each(customButtons, (button) => {
          editor.addButton('custombuttons', {
            title: button.title,
            text: button.text,
            icon: button.icon,
            image: button.image,
            onclick: button.onClick
          });
        });
      }
    };
  };

}
