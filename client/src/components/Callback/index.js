import React from 'react';
import {connect} from "react-redux";
import {Alert} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

function Callback(props) {
  const {isAuthenticated, loading, error} = props.authorisation;

  return <div className="Callback">
    <div className="container">
      {renderAuthResult()}
    </div>
  </div>;

  function renderAuthResult() {
    if (isAuthenticated) {
      return <Redirect to="/" />;
    } else if (loading) {
      return <div className="text-center">
        Authorizing
      </div>;
    } else if (error) {
      return <div>
        <h1>Authorization error</h1>
        <Alert bsStyle="danger">
          {error.errorDescription}
        </Alert>
      </div>;
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  authorisation: state.authorisation,
});

export default connect(
  mapStateToProps
)(Callback);
