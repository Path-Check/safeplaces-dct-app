import dayjs from 'dayjs';

import { DateTimeUtils } from '../helpers';
import { Possible, ExposureDatum } from '../exposureHistory';
import { toExposureHistory, RawExposure } from './exposureNotifications';

describe('toExposureHistory', () => {
  describe('when there are no exposure notifications', () => {
    it('returns a history of NoKnown Exposures for the past 21 days', () => {
      const rawExposures: RawExposure[] = [];
      const today = Date.now();
      const twentyDaysAgo = dayjs(today).subtract(20, 'day').valueOf();

      const result = toExposureHistory(rawExposures);

      const lastDay = result[result.length - 1].date;
      const firstDay = result[0].date;
      expect(result.length).toBe(21);
      expect(
        result.every((datum: ExposureDatum) => datum.kind === 'NoKnown'),
      ).toBe(true);
      expect(dayjs(lastDay).isSame(today, 'day')).toBe(true);
      expect(dayjs(firstDay).isSame(twentyDaysAgo, 'day')).toBe(true);
    });
  });

  describe('when there was a possible exposure two days ago', () => {
    it('returns a history with a PossibleExposure 2 days ago', () => {
      const today = Date.now();
      const twoDaysAgo = dayjs(today).subtract(2, 'day').valueOf();
      const duration = 30 * 60 * 1000;
      const rawExposures: RawExposure[] = [
        {
          id: 'ABCD-EFGH',
          date: twoDaysAgo,
          duration,
          totalRiskScore: 2,
          transmissionRiskLevel: 3,
        },
      ];
      const expected: Possible = {
        kind: 'Possible',
        date: DateTimeUtils.beginningOfDay(twoDaysAgo),
        duration: duration,
        totalRiskScore: 2,
        transmissionRiskLevel: 3,
      };

      const result = toExposureHistory(rawExposures);

      expect(result[result.length - 3]).toEqual(expected);
    });
  });

  describe('when there are multiple raw exposures on the same day', () => {
    it('combines the raw exposure into a single possible exposure with the sum of duration and max of risk', () => {
      const today = Date.now();
      const beginningOfDay = DateTimeUtils.beginningOfDay(today);
      const duration1 = 30 * 60 * 1000;
      const duration2 = 10 * 60 * 1000;
      const duration3 = 25 * 60 * 1000;
      const rawExposures: RawExposure[] = [
        {
          id: 'raw-exposure-1',
          date: beginningOfDay + 1000,
          duration: duration1,
          totalRiskScore: 1,
          transmissionRiskLevel: 3,
        },
        {
          id: 'raw-exposure-2',
          date: beginningOfDay + 18000,
          duration: duration2,
          totalRiskScore: 7,
          transmissionRiskLevel: 2,
        },
        {
          id: 'raw-exposure-3',
          date: beginningOfDay + 36000,
          duration: duration3,
          totalRiskScore: 4,
          transmissionRiskLevel: 5,
        },
      ];
      const expected: Possible = {
        kind: 'Possible',
        date: DateTimeUtils.beginningOfDay(today),
        duration: duration1 + duration2 + duration3,
        totalRiskScore: 7,
        transmissionRiskLevel: 5,
      };

      const result = toExposureHistory(rawExposures);

      expect(result[result.length - 1]).toEqual(expected);
    });
  });
});
