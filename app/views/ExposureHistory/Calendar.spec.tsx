import React from 'react';
import { cleanup, render } from '@testing-library/react-native';

import { factories } from '../../factories';

import Calendar from './Calendar';
import { toExposureHistory } from '../../bt/exposureNotifications';

afterEach(cleanup);

describe('Calendar', () => {
  it('renders', () => {
    const exposureHistory = buildExposureHistory();
    const onSelectDate = () => {};
    const selectedDatum = exposureHistory[0];

    const { getByTestId } = render(
      <Calendar
        exposureHistory={exposureHistory}
        onSelectDate={onSelectDate}
        selectedDatum={selectedDatum}
      />,
    );

    expect(getByTestId('exposure-history-calendar')).not.toBeNull();
  });
});

const buildExposureHistory = () => {
  const rawExposure = factories.rawExposure.build();
  return toExposureHistory([rawExposure], {
    startDate: Date.now(),
    totalDays: 21,
  });
};
