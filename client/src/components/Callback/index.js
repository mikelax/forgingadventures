import _ from 'lodash';
import React from 'react';
import { connect } from "react-redux";
import { Container, Header, Icon, Message } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

function Callback(props) {
  const { loading, error } = props.authorisation;
  const me = _.get(props, 'me.me');
  const meLoading = _.get(props, 'me.loading');
  const completedAt = _.get(me, 'completedAt');

  return <div className="Callback">
    <Container>
      <Header as='h2' icon textAlign='center'>
        <Icon name='unlock' circular/>
        <Header.Content>
          Authorizing
        </Header.Content>
      </Header>
      {renderAuthResult()}
    </Container>
  </div>;

  function renderAuthResult() {
    if (me) {
      if (!(completedAt)) {
        return <Redirect to="/login/almost-finished"/>;
      } else {
        return <Redirect to="/"/>;
      }
    } else if (loading || meLoading) {
      return <div className="text-center">
        Authorizing
      </div>;
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
