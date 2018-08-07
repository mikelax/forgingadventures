import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

export default function TimezoneDiff(props) {
  const { timezone } = props;

  if (timezone) {
    const now = moment();
    const tzTime = moment.tz.zone(timezone);
    const localTime = moment.tz.zone(moment.tz.guess());

    const diff = (localTime.utcOffset(now) - tzTime.utcOffset(now)) / 60;
    const sign = diff < 0 ? '' : '+';

    return (
      <Popup
        trigger={<span>{`${timezone} (${sign}${diff} hrs from you)`}</span>}
        content={`Local time is: ${now.tz(timezone).format('h:m a')}`}
      />
    );
  } else {
    return null;
  }
}

TimezoneDiff.propTypes = {
  timezone: PropTypes.string
};
