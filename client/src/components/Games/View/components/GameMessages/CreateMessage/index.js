import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, Query } from 'react-apollo';
import { Form, Button, Segment, Radio, Dimmer, Grid } from 'semantic-ui-react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import RichEditor from 'components/shared/components/RichEditor';

import DiceRollerModal from '../DiceRollerModal';
import DiceRollFormSummary from '../DiceRollFormSummary';
import GmHeader from '../GmHeader';
import InCharacterHeader from '../InCharacterHeader';
import OutOfCharacterHeader from '../OutOfCharacterHeader';

import { createGameMessageMutation, myGamePlayerQuery } from 'components/Games/queries';

import DiceIcon from './dice.svg';

import './CreateMessage.styl';

class CreateMessage extends Component {

  state = {
    hasContent: false,
    saving: false,
    form: {},
    rollingDice: false
  };

  editor = React.createRef();

  componentWillReceiveProps(nextProps) {
    const gameMessage = _.get(nextProps, 'gameMessage.message');

    if (gameMessage) {
      this.editor.current.addQuoteBlock(gameMessage);
    }
  }

  render() {
    const { saving, rollingDice, form: { meta } } = this.state;
    const { gameId } = this.props;
    const rolls = _.get(meta, 'rolls');

    return (
      <div className="create-message">
        <Form>
          <Form.Field>
            <Query
              query={myGamePlayerQuery}
              variables={{ gameId }}
            >
              {({ data }) => <PostAsSelector data={data} onPostTypeChange={this._handlePostType}/>}
            </Query>

            <label>Add Message</label>
            <RichEditor ref={this.editor} onChange={this._handleOnChange} customButtons={this._customButtons()}/>
          </Form.Field>

          <DiceRollFormSummary rolls={rolls} onRemove={this._handleRemoveDie} />

          <Button primary
                  onClick={this._submit}
                  loading={saving}
                  disabled={!(this.state.hasContent)}>
            Submit
          </Button>
        </Form>

        <DiceRollerModal
          active={rollingDice}
          onCancel={this._closeDiceForm}
          onDiceRolled={this._handleDiceRoll}
        />
      </div>
    );
  }

  _customButtons = () => {
    return [{
      title: 'Add dice rolls',
      image: DiceIcon,
      onClick: this._showDiceModal
    }];
  };

  _showDiceModal = () => {
    const ic = _.get(this.state, 'form.postType') === 'ic';
    // only show the modal if ic
    ic && this.setState({ rollingDice: true });
  };

  _handleDiceRoll = (rolls) => {
    this.setState(({ form }) => ({
      form: { ...form, meta: { rolls: [...form.meta.rolls, ...rolls] } }
    }), () => this._closeDiceForm());
  };

  _closeDiceForm = () => {
    this.setState({ rollingDice: false });
  };

  _handleRemoveDie = (die) => {
    this.setState(({ form  }) => ( {
      form: { ...form, meta: { rolls: _.reject(form.meta.rolls, die) } }
    } ));
  };

  _handleOnChange = (data) => {
    if (data.hasContent !== this.state.hasContent) {
      this.setState({ hasContent: data.hasContent });
    }
  };

  _handlePostType = (postType) => {
    this.setState(prevState => {
      const form = _.merge({}, prevState.form, postType);
      return { form };
    });
  };

  _submit = () => {
    const { hasContent } = this.state;
    const { mutate, gameId } = this.props;
    const { form: { postType, characterId, meta } } = this.state;

    this.setState((state) => ({ saving: state.hasContent }));

    return hasContent && mutate({
      variables: {
        input: {
          message: this.editor.current.getEditorMessage(),
          gameId,
          postType,
          characterId,
          meta
        }
      }
    })
      .then(() => this.editor.current.clear())
      .finally(() => this.setState({ saving: false, form: {} }));
  };
}

class PostAsSelector extends Component {

  static propTypes = {
    onPostTypeChange: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  };

  state = {
    postType: null
  };

  UNSAFE_componentWillMount() {
    const character = this._getMyGamePlayerCharacter();
    const gameMaster = this._getGameMaster();

    let postType;

    if (gameMaster) {
      postType = 'gm';
    } else if (character) {
      postType = 'ic';
    } else {
      postType = 'ooc';
    }

    this.setState(
      () => ({ postType }),
      () => this._doOnPostTypeChange()
    );
  }

  render() {
    const character = this._getMyGamePlayerCharacter();
    const user = this._getMyGamePlayerUser();
    const gameMaster = this._getGameMaster();

    const postSelector = _.isEmpty(gameMaster)
      ? this._getPlayerSelector(user, character)
      : this._getGmSelector(gameMaster.user);

    return (
      <React.Fragment>
        <label>Post As</label>
        {postSelector}
      </React.Fragment>
    );
  }

  _getGmSelector = (user) => {
    const gm = this.state.postType === 'gm';

    return (
      <div className="post-as-selector">
        <div className="in-character">
          <Dimmer.Dimmable as={Segment} basic dimmed={!(gm)}>
            <Dimmer active={!(gm)} inverted />
            <Grid>
              <GmHeader user={user} />
            </Grid>
          </Dimmer.Dimmable>

        </div>

        <div className="selector">
          <Radio toggle checked={gm} onChange={this._handleToggle('gm')} />
        </div>

        <div className="out-character">
          <Dimmer.Dimmable as={Segment} basic dimmed={gm}>
            <Dimmer active={gm} inverted />
            <Grid>
              <OutOfCharacterHeader user={user} />
            </Grid>
          </Dimmer.Dimmable>

        </div>
      </div>
    );
  };

  _getPlayerSelector = (user, character) => {
    const ic = this.state.postType === 'ic';

    return (
      <div className="post-as-selector">
        <div className="in-character">
          <Dimmer.Dimmable as={Segment} basic dimmed={!(ic)}>
            <Dimmer active={!(ic)} inverted />
            <Grid>
              <InCharacterHeader character={character} />
            </Grid>
          </Dimmer.Dimmable>

        </div>

        <div className="selector">
          <Radio toggle checked={ic} onChange={this._handleToggle('ic')} />
        </div>

        <div className="out-character">
          <Dimmer.Dimmable as={Segment} basic dimmed={ic}>
            <Dimmer active={ic} inverted />
            <Grid>
              <OutOfCharacterHeader user={user} />
            </Grid>
          </Dimmer.Dimmable>

        </div>
      </div>
    );
  };

  _handleToggle = (selectedPostType) => (e, data) => {
    const { checked } = data;
    const postType = checked ? selectedPostType : 'ooc';

    this.setState(
      () => ({ postType }),
      () => this._doOnPostTypeChange()
    );
  };

  _doOnPostTypeChange = () => {
    const { postType } = this.state;
    const { onPostTypeChange } = this.props;
    const character = this._getMyGamePlayerCharacter();

    const payload = {
      postType,
      characterId: postType === 'ic' ? character.id : null
    };

    onPostTypeChange(payload);
  };

  _getGameMaster = () => {
    const { data } = this.props;
    return _(data).chain().get('myGamePlayer').filter({ status: 'game-master' }).first().value();
  };

  _getMyGamePlayer = () => {
    const { data } = this.props;
    return _(data).chain().get('myGamePlayer').filter({ status: 'accepted' }).first().value();
  };

  _getMyGamePlayerCharacter = () => {
    const myGamePlayer = this._getMyGamePlayer();
    return _.get(myGamePlayer, 'character');
  };

  _getMyGamePlayerUser = () => {
    const myGamePlayer = this._getMyGamePlayer();
    return _.get(myGamePlayer, 'user');
  };

}

export default compose(
  graphql(createGameMessageMutation),
  connect(
    (state) => ({ gameMessage: state.gameMessage })
  )
)(CreateMessage);
