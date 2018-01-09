import React from 'react';
import {connect} from "react-redux";
import { Redirect } from 'react-router-dom';

function Callback(props) {
  const {isAuthenticated} = props.authorisation;

  if (isAuthenticated) {
    return <Redirect to="/"/>;
  } else {
    return <div className="text-center">
      Authorising
    </div>;
  }
}

const mapStateToProps = state => ({
  authorisation: state.authorisation,
});

export default connect(
  mapStateToProps
)(Callback);
