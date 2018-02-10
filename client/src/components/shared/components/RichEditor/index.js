import { convertFromRaw, convertToRaw, Editor, EditorState, RichUtils, Modifier } from 'draft-js';
import { OrderedSet } from 'immutable';
import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import './assets/GameLoungeMessage.styl';

export default class RichEditor extends Component {

  static propTypes = {
    message: PropTypes.object,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func
  };

  state = {
    editorState: EditorState.createEmpty()
  };

  componentWillMount() {
    const { message } = this.props;

    if (message) {
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(message))
      });
    }
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.message) {
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(nextProp.message))
      });
    } else {
      this.setState({
        message: EditorState.createEmpty()
      });
    }
  }

  render() {
    const { editorState } = this.state;
    const { readOnly } = this.props;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    const contentState = editorState.getCurrentContent();

    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="RichEditor-root">
        {this._renderToolbar()}
        <div className={className} onClick={this._focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            editorState={editorState}
            handleKeyCommand={this._handleKeyCommand}
            onChange={this._onChange}
            onTab={this._onTab}
            placeholder="What's on your mind..."
            ref="editor"
            spellCheck={true}
            readOnly={readOnly}
          />
        </div>
      </div>
    );
  }

  clear() {
    this.setState({
      editorState: EditorState.createEmpty()
    });
  }

  getEditorMessage() {
    return convertToRaw(this.state.editorState.getCurrentContent());
  }

  addQuoteBlock(text) {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const textWithEntity = Modifier.insertText(contentState, selection, text, OrderedSet.of('ITALIC'));

    const newState = EditorState.push(
      editorState,
      textWithEntity,
      'insert-characters'
    );

    this._onChange(newState);
  };

  _renderToolbar = () => {
    const { editorState } = this.state;
    const { readOnly } = this.props;

    if (!(readOnly)) {
      return (
        <div className="editor-toolbar">
          <BlockStyleControls
            editorState={editorState}
            onToggle={this._toggleBlockType}
          />
          &nbsp;
          <InlineStyleControls
            editorState={editorState}
            onToggle={this._toggleInlineStyle}
          />
        </div>
      );
    } else {
      return null;
    }
  };


  _focus = () => this.refs.editor.focus();

  _onChange = (editorState) => {
    const content = editorState.getCurrentContent();
    const { onChange } = this.props;

    this.setState({ editorState });

    onChange && onChange({
      hasContent: content.hasText()
    });
  };

  _handleKeyCommand = (command) => {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this._onChange(newState);
      return true;
    }
    return false;
  };

  _onTab = (e) => {
    const maxDepth = 4;
    this._onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  };

  _toggleBlockType = (blockType) => {
    this._onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  };

  _toggleInlineStyle = (inlineStyle) => {
    this._onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  };

}

// Custom overrides for "code" style.

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}

class StyleButton extends React.Component {
  render() {
    return (
      <Button size="mini" icon active={this.props.active} onClick={this._onToggle}>
        <Icon name={this.props.label}/>
      </Button>
    );
  }

  _onToggle = (e) => {
    e.preventDefault();
    this.props.onToggle(this.props.style);
  };

}

const BLOCK_TYPES = [
  { label: 'header', style: 'header-three' },
  { label: 'quote left', style: 'blockquote' },
  { label: 'unordered list', style: 'unordered-list-item' },
  { label: 'ordered list', style: 'ordered-list-item' }
];

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <Button.Group>
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </Button.Group>
  );
};

const INLINE_STYLES = [
  { label: 'bold', style: 'BOLD' },
  { label: 'italic', style: 'ITALIC' },
  { label: 'underline', style: 'UNDERLINE' }
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  console.log('currentStyle', currentStyle)
  return (
    <Button.Group>
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </Button.Group>
  );
};