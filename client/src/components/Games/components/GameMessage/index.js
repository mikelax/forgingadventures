import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CompositeDecorator, convertFromRaw, convertToRaw, Editor, EditorState, Entity, Modifier,
  RichUtils
} from 'draft-js';
import { getSelectionEntity } from 'draftjs-utils';
import { Button, Image } from 'semantic-ui-react';

import './assets/GameMessage.styl';

import iconMusic from './assets/icon-music-note.svg';
import iconThink from './assets/think.svg';
import iconShout from './assets/shouting.svg';

/**
 * GamesMessage is export wrapper component around draft js
 * This module also contains GamesMessage sub-components - i.e. toolbar and inline and block style definitions
 */
export default class GamesMessage extends Component {

  static propTypes = {
    message: PropTypes.object,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func
  };

  state = {
    editorState: EditorState.createEmpty(decorator)
  };

  componentWillMount() {
    const { message } = this.props;

    if (message) {
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(message), decorator)
      });
    }
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.message) {
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(nextProp.message), decorator)
      });
    } else {
      this.setState({
        message: EditorState.createEmpty(decorator)
      });
    }
  }

  render() {
    const { editorState } = this.state;
    const { readOnly, placeholder } = this.props;
    const editingClass = readOnly ? '' : 'editing';

    return (
      <div className={`GameMessage ${editingClass}`} onClick={this._focus}>
        {this._toolbar()}
        <div className="editor-container">
          <Editor editorState={editorState}
                  onChange={onEditorChange.bind(this)}
                  ref="editor"
                  placeholder={placeholder}
                  readOnly={readOnly}/>
        </div>
      </div>
    );
  }

  clear() {
    const { onChange } = this.props;

    this.setState({
      editorState: EditorState.createEmpty(decorator)
    });

    onChange && onChange({
      hasContent: false
    });
  }

  getEditorMessage() {
    return convertToRaw(this.state.editorState.getCurrentContent());
  }

  addQuoteBlock(message) {
    const newBlocks = _.map(message.blocks, (block) => {
      return _.tap(block, b => (b.type = 'blockquote'));
    });
    const { editorState } = this.state;
    const currentContentRaw = this.getEditorMessage();

    currentContentRaw.blocks = _.concat(currentContentRaw.blocks, newBlocks);
    currentContentRaw.entityMap = _.merge({}, currentContentRaw.entityMap, message.entityMap);

    const newState =  EditorState.push( editorState, convertFromRaw(currentContentRaw), 'insert-characters');

    onEditorChange.call(this, newState);
  }

  _focus = () => this.refs.editor.focus();

  _toolbar = () => {
    const { readOnly } = this.props;
    const { editorState } = this.state;

    if (!(readOnly)) {
      return (
        <div className="editor-controls">
          <ActionControls
            editorState={editorState}
            onToggle={onToggleAction.bind(this)}
          />
          &nbsp;
          <BlockControls
            editorState={editorState}
            onToggle={toggleBlockStyle.bind(this)}
          />
        </div>
      );
    }
  }

}

/// private GamesMessage methods - i.e. handlers etc...

function onEditorChange(editorState) {
  const content = editorState.getCurrentContent();
  const { onChange } = this.props;

  this.setState({ editorState });

  onChange && onChange({
    hasContent: content.hasText()
  });
}

function onToggleAction(entityKey) {
  const editorState = this.state.editorState;
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const selectionEntity = getSelectionEntity(editorState);
  const collapsed = selection.isCollapsed();

  // many many many options here
  // 1. caret is selecting a range with no entity - apply entity
  if (!collapsed && !selectionEntity) {
    const textWithEntity = Modifier.applyEntity(currentContent, selection, entityKey);
    onEditorChange.call(this, EditorState.push(editorState, textWithEntity, 'apply-entity'));
  }
  // 2. caret contains selection and the selection matches the entityKey - remove entity
  else if (!collapsed && selectionEntity === entityKey) {
    const textWithEntity = Modifier.applyEntity(currentContent, selection, null);
    onEditorChange.call(this, EditorState.push(editorState, textWithEntity, 'apply-entity'));
  }
  // 3. caret contains selection and the selection doesn't matches the entityKey - remove entity and apply new one
  else if (!collapsed && selectionEntity !== entityKey) {
    const textWithEntity = Modifier.applyEntity(currentContent, selection, entityKey);
    onEditorChange.call(this, EditorState.push(editorState, textWithEntity, 'apply-entity'));
  }
  // 4. caret is collapsed (i.e. no selection) and a new style is being applied - insert new style
  else if (collapsed && selectionEntity !== entityKey) {
    const textWithEntity = Modifier.insertText(currentContent, selection, ' ', null, entityKey);
    onEditorChange.call(this, EditorState.push(editorState, textWithEntity, 'insert-characters'));
  }
  // 5. caret is collapsed (i.e. no selection) and the same style is being applied - insert a break
  // FIXME - this is a bit iffy - think about this one
  else if (collapsed && selectionEntity === entityKey) {
    const textWithEntity = Modifier.insertText(currentContent, selection, ' ', null, null);
    onEditorChange.call(this, EditorState.push(editorState, textWithEntity, 'apply-entity'));
  }
  // we shouldn't get here!11
  else {
    throw new Error('boom! boom!');
  }
}

function toggleBlockStyle(blockType) {
  onEditorChange.call(this,
    RichUtils.toggleBlockType(
      this.state.editorState,
      blockType
    )
  );
}


/*
 ActionControls is the toolabr component, which is built based on styles defined in buttons
 */

const ActionControls = (props) => {
  const { editorState } = props;
  const selectionEntity = getSelectionEntity(editorState);

  return (
    <Button.Group icon={true}>
      {buttons.map(button =>
        <ActionButton
          key={button.type}
          entity={button.entity}
          active={selectionEntity === button.entity}
          onToggle={props.onToggle}
          type={button.type}
          icon={button.icon}
        />
      )}
    </Button.Group>
  );
};

const BLOCK_TYPES = [
  { label: 'quote left', style: 'blockquote' },
  { label: 'unordered list', style: 'unordered-list-item' },
  { label: 'ordered list', style: 'ordered-list-item' }
];

const BlockControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <Button.Group icon={true}>
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

class StyleButton extends React.Component {
  render() {
    return (
      <Button active={this.props.active} onMouseDown={this._onToggle} size="mini" icon={this.props.label} />
    );
  }

  _onToggle = (e) => {
    e.preventDefault();
    this.props.onToggle(this.props.style);
  };

}


/*
ActionButton is the toolbar button
 */


class ActionButton extends React.Component {
  render() {
    return (
      <Button
        size="mini"
        active={this.props.active}
        title={this.props.type}
        content={<Image src={this.props.icon} className="super-mini"/>}
        onMouseDown={this._toggle} />
    );
  }

  _toggle = (e) => {
    e.preventDefault();
    this.props.onToggle(this.props.entity);
  };
}

/*
define individual styles as functional components
*/

const ThinkSpan = (props) => {
  return (
    <span className="thinking" data-offset-key={props.offsetkey}>
      {props.children}
    </span>
  );
};

const ShoutSpan = (props) => {
  return (
    <span className="shouting" data-offset-key={props.offsetkey}>
      {props.children}
    </span>
  );
};
const SingSpan = (props) => {
  return (
    <span className="singing" data-offset-key={props.offsetkey}>
      <img src={iconMusic} alt="singing"/>
      {props.children}
      <img src={iconMusic} alt="singing"/>
    </span>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findEntitiesByType('SHOUT'),
    component: ShoutSpan
  },
  {
    strategy: findEntitiesByType('THINK'),
    component: ThinkSpan
  },
  {
    strategy: findEntitiesByType('SING'),
    component: SingSpan
  }
]);

const buttons = [
  {
    icon: iconShout,
    type: 'SHOUT',
    entity: Entity.create('SHOUT', 'MUTABLE')
  },
  {
    icon: iconThink,
    type: 'THINK',
    entity: Entity.create('THINK', 'MUTABLE')
  },
  {
    icon: iconMusic,
    type: 'SING',
    entity: Entity.create('SING', 'MUTABLE')
  }
];

function findEntitiesByType(type) {
  return function (contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === type
        );
      },
      callback
    );
  };
}
