import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

import { toExposureHistory } from '../../bt/exposureNotifications';
import { factories } from '../../factories';

import History from './History';

const CALENDAR_LENGTH = 21;

afterEach(cleanup);
jest.mock('@react-navigation/native');
(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() });

describe('History', () => {
  it('renders', () => {
    const exposureHistory = buildBlankExposureHistory();

    const { getByTestId } = render(
      <History exposureHistory={exposureHistory} />,
    );

    expect(getByTestId('exposure-history-calendar')).not.toBeNull();
  });
});

const buildBlankExposureHistory = () => {
  const datum = factories.exposureDatum.build();
  const exposureInfo = {
    [datum.date]: datum,
  };
  return toExposureHistory(exposureInfo, {
    startDate: Date.now(),
    totalDays: CALENDAR_LENGTH,
  });
};
