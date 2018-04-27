import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './assets/FieldErrorMessage.styl';

export default class extends Component {
  static contextTypes = {
    formik: PropTypes.object
  };

  static propTypes = {
    name: PropTypes.string.isRequired
  };

  render() {
    const { name } = this.props;
    const { context: { formik: { errors, touched } } } = this;
    const dirty = _.get(touched, name);
    const error = _.get(errors, name);

    return (
      (dirty && error && <span className="field-message">{error}</span>) || null
    );
  }
}
