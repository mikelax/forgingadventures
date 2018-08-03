import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Radio } from 'semantic-ui-react';

export default class extends React.Component {
  static contextTypes = {
    formik: PropTypes.object
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string
  };

  render() {
    const { name, label } = this.props;
    const { context: { formik: { values } } } = this;

    const checked = _.get(values, name);

    return (
      <Radio
        label={label}
        name={name}
        toggle
        checked={checked}
        onChange={this._handleChange}/>
    );
  }

  _handleChange = (e, data) => {
    const { context: { formik: { setFieldValue } } } = this;
    const { name } = this.props;
    const { checked } = data;

    setFieldValue(name, checked);
  }
}
