import React from 'react';
import { cleanup, render } from '@testing-library/react-native';

import { calendarDays, toExposureHistory } from '../../exposureHistory';
import { factories } from '../../factories';

import Calendar from './Calendar';

afterEach(cleanup);

describe('Calendar', () => {
  it('renders', () => {
    const exposureHistory = buildExposureHistory();
    const onSelectDate = () => {};
    const selectedDatum = exposureHistory[0];

    const { asJSON } = render(
      <Calendar
        exposureHistory={exposureHistory}
        onSelectDate={onSelectDate}
        selectedDatum={selectedDatum}
      />,
    );

    expect(asJSON()).toMatchSnapshot();
  });
});

const buildExposureHistory = () => {
  const datum = factories.exposureDatum.build();
  const exposureInfo = {
    [datum.date]: datum,
  };
  const calendar = calendarDays(Date.now(), 21);
  return toExposureHistory(exposureInfo, calendar);
};
