import _ from 'lodash';
import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Button, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';

import {createGameLoungeMessageMutation} from '../queries';

class CreateGameLoungeMessage extends Component {

  state = {
    message: ''
  };

  render() {
    return (
      <div className="create-message">
        <form>
          <FormGroup>
            <ControlLabel>Add Message</ControlLabel>
            <FormControl componentClass="textarea" placeholder="textarea"
                         value={this.formValue('message')}
                         onChange={this.formInput('message')}
            />
          </FormGroup>
        </form>

        <Button bsStyle="primary" onClick={this.submit}>Submit</Button>
      </div>
    );
  }

  //setMessage = ({message}) => this.setState({message});

  formInput = (stateKey) => {
    return (e) => {
      const state = _.merge({}, this.state);

      this.setState(_.set(state, stateKey, e.target.value));
    };
  };

  formValue = (stateKey) => {
    return _.get(this.state, stateKey, '');
  };

  submit = () => {
    const {mutate} = this.props;

    mutate({
      variables: {
        input: {
          gameId: this.props.gameId,
          message: {message: this.state.message}
        }
      }
    })
      .then(() => {
        this.setState({message: ''});
        //this.editor.clear();
      });
  };
}

export default graphql(createGameLoungeMessageMutation)(CreateGameLoungeMessage);