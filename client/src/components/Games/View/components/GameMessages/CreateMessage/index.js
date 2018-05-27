import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, Query } from 'react-apollo';
import { Form, Button, Segment, Radio, Dimmer, Grid } from 'semantic-ui-react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import RichEditor from 'components/shared/components/RichEditor';

import GmHeader from '../GmHeader';
import InCharacterHeader from '../InCharacterHeader';
import OutOfCharacterHeader from '../OutOfCharacterHeader';

import { createGameMessageMutation, myGamePlayerQuery } from 'components/Games/queries';

import './CreateMessage.styl';

class CreateMessage extends Component {

  state = {
    hasContent: false,
    saving: false,
    form: null
  };

  editor = React.createRef();

  componentWillReceiveProps(nextProps) {
    const gameMessage = _.get(nextProps, 'gameMessage.message');

    if (gameMessage) {
      this.editor.current.addQuoteBlock(gameMessage);
    }
  }

  render() {
    const { saving } = this.state;
    const { gameId } = this.props;

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
            <RichEditor ref={this.editor} onChange={this._handleOnChange}/>
          </Form.Field>

          <Button primary
                  onClick={this._submit}
                  loading={saving}
                  disabled={!(this.state.hasContent)}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }

  _handleOnChange = (data) => {
    this.setState({ hasContent: data.hasContent });
  };

  _handlePostType = (postType) => {
    const form = _.merge({}, this.state.form, postType);
    this.setState({ form });
  };

  _submit = () => {
    const { hasContent } = this.state;
    const { mutate, gameId } = this.props;
    const { form: { postType, characterId } } = this.state;

    this.setState({ saving: hasContent });

    return hasContent && mutate({
      variables: {
        input: {
          message: this.editor.current.getEditorMessage(),
          gameId,
          postType,
          characterId
        }
      }
    })
      .then(() => this.editor.current.clear())
      .finally(() => this.setState({ saving: false }));
  };
}

class PostAsSelector extends Component {

  static propTypes = {
    onPostTypeChange: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  };

  state = {
    ic: true
  };

  componentDidMount() {
    const character = this._getMyGamePlayerCharacter();

    this.setState(
      () => ({ ic: !(_.isEmpty(character)) || !_.isEmpty(this._getGameMaster()) }),
      () => this._doOnPostTypeChange()
    );
  }

  render() {
    const character = this._getMyGamePlayerCharacter();
    const user = this._getMyGamePlayerUser();
    const gameMaster = this._getGameMaster();

    const postSelector = !_.isEmpty(gameMaster) ? this._getGmSelector(gameMaster.user) : this._getPlayerSelector(user, character);

    return (
      <React.Fragment>
        <label>Post As</label>
        {postSelector}
      </React.Fragment>
    );
  }

  _getGmSelector = (user) => {
    return (
      <div className="post-as-selector">
        <div className="in-character">
          <Dimmer.Dimmable as={Segment} basic dimmed={!(this.state.ic)}>
            <Dimmer active={!(this.state.ic)} inverted />
            <Grid>
              <GmHeader user={user} />
            </Grid>
          </Dimmer.Dimmable>

        </div>

        <div className="selector">
          <Radio toggle checked={this.state.ic} onChange={this._handleToggle} />
        </div>

        <div className="out-character">
          <Dimmer.Dimmable as={Segment} basic dimmed={this.state.ic}>
            <Dimmer active={this.state.ic} inverted />
            <Grid>
              <OutOfCharacterHeader user={user} />
            </Grid>
          </Dimmer.Dimmable>

        </div>
      </div>
    );
  }

  _getPlayerSelector = (user, character) => {
    return (
      <div className="post-as-selector">
        <div className="in-character">
          <Dimmer.Dimmable as={Segment} basic dimmed={!(this.state.ic)}>
            <Dimmer active={!(this.state.ic)} inverted />
            <Grid>
              <InCharacterHeader character={character} />
            </Grid>
          </Dimmer.Dimmable>

        </div>

        <div className="selector">
          <Radio toggle checked={this.state.ic} onChange={this._handleToggle} />
        </div>

        <div className="out-character">
          <Dimmer.Dimmable as={Segment} basic dimmed={this.state.ic}>
            <Dimmer active={this.state.ic} inverted />
            <Grid>
              <OutOfCharacterHeader user={user} />
            </Grid>
          </Dimmer.Dimmable>

        </div>
      </div>
    );
  }

  _handleToggle = (e, data) => {
    const { checked } = data;

    this.setState(
      () => ({ ic: checked }),
      () => this._doOnPostTypeChange()
    );
  };

  _doOnPostTypeChange = () => {
    const { ic } = this.state;
    const { onPostTypeChange } = this.props;
    const character = this._getMyGamePlayerCharacter();
    const gm = this._getGameMaster();

    const payload = {
      postType: !_.isEmpty(gm) ? ic ? 'gm' : 'ooc' : ic ? 'ic' : 'ooc',
      characterId: ic && _.isEmpty(gm) ? character.id : null
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
