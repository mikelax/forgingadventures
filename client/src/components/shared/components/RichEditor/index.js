import _ from 'lodash';
import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';
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
    message: ''
  };

  componentWillMount() {
    const { message } = this.props;

    if (message) {
      this.setState({
        message
      });
    }
  }

  componentWillReceiveProps(nextProp) {
    const { message } = nextProp;

    if (message) {
      this.setState({
        message
      });
    } else {
      this.setState({
        message: ''
      });
    }
  }

  render() {
    const { message } = this.state;
    const { readOnly } = this.props;

    const displayComponent = readOnly ?
      <RenderMessage message={message} /> : <RichTextDisplayEditor message={message} onChange={this._handleOnChange} />;

    return (
      <div className="rich-text-display">
        {displayComponent}
      </div>
    );
  }

  _handleOnChange = (meta) => {
    const { onChange } = this.props;

    if (_.isFunction(onChange)) {
      onChange({
        hasContent: meta.wordCount > 0
      });
    }
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


  componentDidMount() {
    return CkEditor
      .create(this.editorEl)
      .then(editor => (this.editor = editor))
      .then(() => {
        const { message } = this.props;

        if (message) {
          this.editor.setData(message);
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



  _handleOnChange = () => {
    const { onChange } = this.props;
    const data = this.editor.getData().replace('<p>&nbsp;</p>', '');

    onChange({
      wordCount: (data || '').length
    });
  }


}
