import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Loader, Message } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import { processLockCallback } from '../../../services/login';

class Callback extends React.Component {

  componentDidMount() {
    processLockCallback();
  }

  render() {
    return <div className="Callback">
      <Container>
        <Header as='h2' icon textAlign='center'>
          <Loader active size='huge' inline='centered'>
            Logging In
          </Loader>
        </Header>

        {this._renderAuthResult()}
      </Container>
    </div>;
  }

  _renderAuthResult = () => {
    const { loading, error } = this.props.authorisation;
    const me = _.get(this.props, 'me.me');
    const meLoading = _.get(this.props, 'me.loading');
    const completedAt = _.get(me, 'completedAt');

    if (me) {
      if (!(completedAt)) {
        return <Redirect to="/login/almost-finished"/>;
      } else {
        return <Redirect to="/"/>;
      }
    } else if (loading || meLoading) {
      return null;
    } else if (error) {
      return <div>
        <Message negative>
          <Message.Header>Authorization error</Message.Header>
          <p>{error.errorDescription}</p>
        </Message>
      </div>;
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  authorisation: state.authorisation,
  me: state.me
});

export default connect(
  mapStateToProps
)(Callback);
