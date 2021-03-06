import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

import { uploadImage } from 'services/image';

import './assets/RichEditor.styl';

export default class RichTextDisplay extends React.Component {

  static propTypes = {
    customButtons: PropTypes.array,
    customStyles: PropTypes.array,
    message: PropTypes.string,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func
  };

  state = {
    message: null
  };

  editor = React.createRef();

  messageContent = null;

  componentDidMount() {
    const { message } = this.props;

    this.setState({ message });
  }

  componentDidUpdate() {
    const { message } = this.props;

    if (message && ( message !== this.state.message )) {
      this.setState({ message });
    }
  }

  render() {
    const { message, customButtons, customStyles, readOnly } = this.props;

    const displayComponent = readOnly
      ? <RenderMessage message={message}/>
      : <RichTextDisplayEditor
        ref={this.editor}
        message={message}
        customButtons={customButtons}
        customStyles={customStyles}
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

class RichTextDisplayEditor extends React.Component {

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
    const { customButtons , customStyles: style_formats } = this.props;
    const toolbarTemplate = _.template('bold italic underline | alignleft aligncenter alignright | formatselect ${styleselect} | bullist numlist | outdent indent blockquote forecolor backcolor | undo redo | image | custombuttons'); //eslint-disable-line
    const toolbarSwitches = {
      styleselect: _.isEmpty(style_formats) ? '' : 'styleselect'
    };

    return {
      menubar: false,
      branding: false,
      elementpath: false,
      theme: 'modern',
      end_container_on_empty_block: true,
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
      block_formats: 'Paragraph=p;Header=h2',
      plugins: [
        'link image lists colorpicker',
        'fullscreen media imagetools',
        'directionality textcolor textcolor colorpicker textpattern'
      ],
      toolbar: toolbarTemplate(toolbarSwitches),
      content_css: [
        `${window.PUBLIC_URL}/editor.css`
      ],
      style_formats,
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
