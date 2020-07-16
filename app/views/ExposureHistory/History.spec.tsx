import React from 'react';
import {
  fireEvent,
  wait,
  cleanup,
  render,
} from '@testing-library/react-native';

import { toExposureHistory } from '../../bt/exposureNotifications';
import { DateTimeUtils } from '../../helpers';
import { factories } from '../../factories';

import History from './History';
import { isGPS } from '../../COVIDSafePathsConfig';

const CALENDAR_LENGTH = 21;

afterEach(cleanup);

describe('History', () => {
  it('renders', () => {
    const exposureHistory = buildBlankExposureHistory();

    const { getByTestId } = render(
      <History exposureHistory={exposureHistory} />,
    );

    expect(getByTestId('exposure-history-calendar')).not.toBeNull();
  });

  describe('when given an exposure history that has a possible exposure', () => {
    describe('and the user taps the date of that exposure', () => {
      jest.mock('react-native-config', () => ({ TRACING_STRATEGY: 'bt' }));
      it("shows a 'Next Steps' button", async () => {
        jest.setTimeout(30000);
        const twoDaysAgo = DateTimeUtils.beginningOfDay(
          DateTimeUtils.daysAgo(2),
        );
        const datum = factories.exposureDatum.build({
          kind: 'Possible',
          date: twoDaysAgo,
        });
        const exposureInfo = {
          [datum.date]: datum,
        };
        const exposureHistory = toExposureHistory(exposureInfo, {
          startDate: Date.now(),
          totalDays: CALENDAR_LENGTH,
        });

        const { queryByTestId, getByTestId } = render(
          <History exposureHistory={exposureHistory} />,
        );

        const twoDaysAgoIndicator = getByTestId(`calendar-day-${twoDaysAgo}`);

        expect(queryByTestId('exposure-history-next-steps-button')).toBeNull();

        fireEvent.press(twoDaysAgoIndicator);

        await wait(() => {
          if (!isGPS) {
            expect(
              getByTestId('exposure-history-next-steps-button'),
            ).not.toBeNull();
          }
        });
      });
    });
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
