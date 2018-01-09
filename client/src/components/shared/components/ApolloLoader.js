import React from 'react';
import { branch, renderComponent } from 'recompose';

const Spinner = () =>
  <div className="Spinner">
    <div className="loader">Loading...</div>
  </div>;

// Define an HoC that displays the Loading component instead of the
// wrapped component when props.data.loading is true
export default branch(
  (props) => props.data.loading,
  renderComponent(Spinner)
);
