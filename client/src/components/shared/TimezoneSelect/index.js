import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import 'react-select/dist/react-select.css';
import timezones from './assets/timezones.json';

export default class TimezoneSelect extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func
  };

  render() {
    const { name, value, onChange } = this.props;

    return <Select
      name={name}
      value={value}
      onChange={onChange}
      options={this._getTimezoneValues()}
    />;
  }

  _getTimezoneValues = () => {
    const values = [];
    _.map(timezones, (o) => {
      _.map(o.utc, (tz) => {
        const label = `${o.text.substring(0, o.text.indexOf(') ')+1)} ${tz} (${o.value})`;
        values.push({ value: tz, label });
      });
    });

    return values;
  };
};
