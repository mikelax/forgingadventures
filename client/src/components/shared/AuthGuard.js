import React from 'react';
import { compose, pure, branch, renderComponent } from 'recompose';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

export default function(ProtectedComponent) {
  return compose(
    connect(
      ({ authorisation }) => ({ authorisation })
    ),
    pure,
    branch(
      props => props.authorisation.isAuthenticated,
      renderComponent(ProtectedComponent),
      renderComponent(() => <Redirect to="/"/>)
    )
  )(ProtectedComponent);
};
