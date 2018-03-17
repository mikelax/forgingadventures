import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

  componentDidMount() {
    const { CKEDITOR } = window;

    //https://sdk.ckeditor.com/samples/fileupload.html#uploading-dropped-and-pasted-images
    CKEDITOR.replace(this.editorEl, {
      // Define the toolbar: http://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_toolbar
      // The standard preset from CDN which we used as a base provides more features than we need.
      // Also by default it comes with a 2-line toolbar. Here we put all buttons in a single row.
      toolbar: [
        { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
        { name: 'styles', items: [ 'Styles', 'Format' ] },
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', '-', 'RemoveFormat' ] },
        { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
        { name: 'links', items: [ 'Link', 'Unlink' ] },
        { name: 'insert', items: [ 'Image', 'EmbedSemantic', 'Table' ] },
        { name: 'tools', items: [ 'Maximize' ] },
        { name: 'editing', items: [ 'Scayt' ] }
      ],
      // Since we define all configuration options here, let's instruct CKEditor to not load config.js which it does by default.
      // One HTTP request less will result in a faster startup time.
      // For more information check http://docs.ckeditor.com/ckeditor4/docs/#!/api/CKEDITOR.config-cfg-customConfig
      customConfig: '',
      // Enabling extra plugins, available in the standard-all preset: http://ckeditor.com/presets-all
      extraPlugins: 'autoembed,embedsemantic,image2,uploadimage,uploadfile',
      /*********************** File management support ***********************/
      // In order to turn on support for file uploads, CKEditor has to be configured to use some server side
      // solution with file upload/management capabilities, like for example CKFinder.
      // For more information see http://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_ckfinder_integration
      // Uncomment and correct these lines after you setup your local CKFinder instance.
      // filebrowserBrowseUrl: 'http://example.com/ckfinder/ckfinder.html',
      // filebrowserUploadUrl: 'http://example.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
      /*********************** File management support ***********************/
      // Remove the default image plugin because image2, which offers captions for images, was enabled above.
      removePlugins: 'image',
      // Make the editing area bigger than default.
      //height: 600,
      // An array of stylesheets to style the WYSIWYG area.
      // Note: it is recommended to keep your own styles in a separate file in order to make future updates painless.
      contentsCss: [ 'https://cdn.ckeditor.com/4.8.0/standard-all/contents.css' ],
      // This is optional, but will let us define multiple different styles for multiple editors using the same CSS file.
      bodyClass: 'article-editor',
      // Reduce the list of block elements listed in the Format dropdown to the most commonly used.
      format_tags: 'p;h2;h3;pre',
      // Simplify the Image and Link dialog windows. The "Advanced" tab is not needed in most cases.
      removeDialogTabs: 'image:advanced;link:advanced',
      // Define the list of styles which should be available in the Styles dropdown list.
      // If the "class" attribute is used to style an element, make sure to define the style for the class in "mystyles.css"
      // (and on your website so that it rendered in the same way).
      // Note: by default CKEditor looks for styles.js file. Defining stylesSet inline (as below) stops CKEditor from loading
      // that file, which means one HTTP request less (and a faster startup).
      // For more information see http://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_styles
      stylesSet: [
        /* Inline Styles */
        { name: 'Marker', element: 'span', attributes: { 'class': 'marker' } },
        { name: 'Inline Quotation', element: 'q' },
        /* Object Styles */
        {
          name: 'Special Container',
          element: 'div',
          styles: {
            padding: '5px 10px',
            background: '#eee',
            border: '1px solid #ccc'
          }
        },
        {
          name: 'Compact table',
          element: 'table',
          attributes: {
            cellpadding: '5',
            cellspacing: '0',
            border: '1',
            bordercolor: '#ccc'
          },
          styles: {
            'border-collapse': 'collapse'
          }
        },
        { name: 'Borderless Table',  element: 'table', styles: { 'border-style': 'hidden', 'background-color': '#E6E6FA' } },
        { name: 'Square Bulleted List', element: 'ul', styles: { 'list-style-type': 'square' } },
        /* Widget Styles */
        // We use this one to style the brownie picture.
        { name: 'Illustration', type: 'widget', widget: 'image', attributes: { 'class': 'image-illustration' } },
        // Media embed
        { name: '240p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-240p' } },
        { name: '360p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-360p' } },
        { name: '480p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-480p' } },
        { name: '720p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-720p' } },
        { name: '1080p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-1080p' } }
      ]
    } );

    CKEDITOR.on('instanceReady', (args) => {
      const { message } = this.props;

      this.editor = args.editor;

      if (message) {
        this.editor.setData(message);
      }

      this.editor.on('change', this._handleOnChange);
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

  insertHtml(html) {
    this.editorEl.focus();

    setTimeout(() => {
    const { CKEDITOR } = window;
    const el = CKEDITOR.dom.element.createFromHtml(html);

    this.editor.insertElement(el);
    }, 100);
  }

  _handleOnChange = () => {
    const { onChange } = this.props;
    const content = this.editor.getData();

    onChange({
      content,
      wordCount: (content || '').length
    });
  }

}
