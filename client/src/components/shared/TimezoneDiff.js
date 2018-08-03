import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

export default function TimezoneDiff(props) {
  const { timezone } = props;

  if (timezone) {
    const now = moment();
    const tzTime = moment.tz.zone(timezone);
    const localTime = moment.tz.zone(moment.tz.guess());

    const diff = (localTime.utcOffset(now) - tzTime.utcOffset(now)) / 60;
    const sign = diff < 0 ? '' : '+';

    return (diff !== 0) && (
      <span title={now.tz(timezone).format('h:m a')}>
        {`${sign}${diff} hours`}
      </span>
    );
  } else {
    return null;
  }
}

TimezoneDiff.propTypes = {
  timezone: PropTypes.string
};
