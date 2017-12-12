import _ from 'lodash';
import React, {Component} from 'react';
import {CompositeDecorator, convertFromRaw, convertToRaw, Editor, EditorState, Entity, Modifier} from 'draft-js';
import {getSelectionEntity} from 'draftjs-utils';

import 'draft-js/dist/Draft.css';
import './GameMessage.css';


export default class GamesMessage extends Component {

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
      const messageChanged = !(_.isEqual(this.props.message, nextProp.message));

      if (messageChanged) {
        this.setState({
          editorState: EditorState.createWithContent(convertFromRaw(nextProp.message), decorator)
        });
      }
    } else {
      this.setState({
        message: EditorState.createEmpty(decorator)
      });
    }
  }

  render() {
    const editorControler = this.props.readOnly ? '' :
      <ActionControls
        editorState={this.state.editorState}
        onToggle={onToggleAction.bind(this)}
      />;

    return (
      <div className="game-message">
        {editorControler}
        <div className="editor-container">
          <Editor editorState={this.state.editorState}
                  onChange={onEditorChange.bind(this)}
                  readOnly={this.props.readOnly}
          />
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

};

/// private implementation details

const ActionControls = (props) => {
  const {editorState} = props;
  const selectionEntity = getSelectionEntity(editorState);

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
        />
      )}
    </div>
  );
};

class ActionButton extends React.Component {
  render() {
    return (
      <button
        className={this.props.active ? 'active' : ''}
        type="button"
        title={this.props.type}
        onMouseDown={this._toggle}>
        {this.props.label}
      </button>
    );
  }

  _toggle = (e) => {
    e.preventDefault();
    this.props.onToggle(this.props.entity);
  };
}

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
      {props.children}
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
    entity: Entity.create('SING', 'MUTABLE')
  }
];

function onEditorChange(editorState) {
  this.setState({editorState});
}

function onToggleAction(entityKey) {
  const editorState = this.state.editorState;
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const textWithEntity = Modifier.applyEntity(currentContent, selection, entityKey);

  onEditorChange.call(this, EditorState.push(editorState, textWithEntity, 'apply-entity'));
}

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
