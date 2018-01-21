import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CompositeDecorator, convertFromRaw, convertToRaw, Editor, EditorState, Entity, Modifier} from 'draft-js';
import {getSelectionEntity} from 'draftjs-utils';

import 'draft-js/dist/Draft.css';
import './assets/GameMessage.styl';

import iconMusic from './assets/icon-music-note.svg';

/**
 * GamesMessage is export wrapper component around draft js
 * This module also contains GamesMessage sub-components - i.e. toolbar and inline and block style definitions
 */
export default class GamesMessage extends Component {

  static propTypes = {
    message: PropTypes.object,
    readOnly: PropTypes.bool
  };

  state = {
    editorState: EditorState.createEmpty(decorator)
  };

  componentWillMount() {
    const {message} = this.props;

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
    const {editorState} = this.state;
    const {readOnly} = this.props;

    const editorControls = readOnly ? null :
      <ActionControls
        editorState={editorState}
        onToggle={onToggleAction.bind(this)}
      />;

    return (
      <div className="GameMessage">
        {editorControls}
        <div className="editor-container">
          <Editor editorState={editorState}
                  onChange={onEditorChange.bind(this)}
                  readOnly={readOnly} />
        </div>
      </div>
    );
  }

  clear() {
    this.setState({
      editorState: EditorState.createEmpty(decorator)
    });
  }

  getEditorMessage() {
    return convertToRaw(this.state.editorState.getCurrentContent());
  }
}

/// private GamesMessage methods - i.e. handlers etc...

function onEditorChange(editorState) {
  console.log('onEditorChange')
  this.setState({editorState});
}

function onToggleAction(entityKey) {
  const editorState = this.state.editorState;
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const selectionEntity = getSelectionEntity(editorState);
  const collapsed = selection.isCollapsed();
  console.log('onToggleAction', entityKey)
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


/*
 ActionControls is the toolabr component, which is built based on styles defined in buttons
 */

const ActionControls = (props) => {
  const {editorState} = props;
  const selectionEntity = getSelectionEntity(editorState);
  console.log('actioncontrols selectionEntity', selectionEntity)
  return (
    <div>
      {buttons.map(button =>
        <ActionButton
          key={button.type}
          entity={button.entity}
          active={selectionEntity === button.entity}
          label={button.label}
          onToggle={props.onToggle}
          type={button.type}
          icon={button.icon}
        />
      )}
    </div>
  );
};


/*
ActionButton is the toolbar button
 */


class ActionButton extends React.Component {
  render() {
    const icon = this.props.icon ?
      <img src={this.props.icon} alt={this.props.label}/>
      : this.props.label;

    return (
      <button
        className={this.props.active ? 'active' : ''}
        type="button"
        title={this.props.type}
        onMouseDown={this._toggle}>
        {icon}
      </button>
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
    component: ShoutSpan,
  },
  {
    strategy: findEntitiesByType('THINK'),
    component: ThinkSpan,
  },
  {
    strategy: findEntitiesByType('SING'),
    component: SingSpan,
  },
]);

const buttons = [
  {
    label: 'S',
    type: 'SHOUT',
    entity: Entity.create('SHOUT', 'MUTABLE')
  },
  {
    label: 'TH',
    type: 'THINK',
    entity: Entity.create('THINK', 'MUTABLE')
  },
  {
    label: 'S',
    type: 'SING',
    icon: iconMusic,
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
