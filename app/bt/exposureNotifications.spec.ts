import dayjs from 'dayjs';

import { DateTimeUtils } from '../helpers';
import { Possible, ExposureDatum, ExposureInfo } from '../exposureHistory';
import {
  toExposureInfo,
  RawExposure,
  toExposureHistory,
} from './exposureNotifications';

describe('toExposureHistory', () => {
  describe('when given a 21 day calendar', () => {
    describe('when given an ExposureInfo with no exposures', () => {
      it('it returns a 21 day history of NoKnown Exposures', () => {
        const today = dayjs('2020-06-26').valueOf();
        const exposureInfo: ExposureInfo = {};

        const result = toExposureHistory(exposureInfo, {
          startDate: today,
          totalDays: 21,
        });

        expect(result.length).toBe(21);
        expect(
          result.every((datum: ExposureDatum) => datum.kind === 'NoKnown'),
        ).toBe(true);
      });
    });

    describe('when given an ExposureInfo with a possible exposure today', () => {
      it('returns an exposure history with the exposures on the correct days', () => {
        const tuesday = dayjs('2020-06-23').valueOf();
        const friday = dayjs('2020-06-26').valueOf();

        const today = friday;

        const tuesdayExposure: ExposureDatum = {
          kind: 'Possible',
          date: tuesday,
          duration: 600000,
          totalRiskScore: 3,
          transmissionRiskLevel: 3,
        };
        const fridayExposure: ExposureDatum = {
          kind: 'Possible',
          date: friday,
          duration: 300000,
          totalRiskScore: 4,
          transmissionRiskLevel: 7,
        };

        const exposureInfo: ExposureInfo = {
          [tuesday]: tuesdayExposure,
          [friday]: fridayExposure,
        };

        const result = toExposureHistory(exposureInfo, {
          startDate: today,
          totalDays: 21,
        });

        const tuesdayResult = result[result.length - 5];
        const wednesdayResult = result[result.length - 4];
        const fridayResult = result[result.length - 2];
        const saturdayResult = result[result.length - 1];

        expect(tuesdayResult).toEqual(tuesdayExposure);
        expect(wednesdayResult.kind).toBe('NoKnown');
        expect(fridayResult).toEqual(fridayExposure);
        expect(saturdayResult.kind).toBe('NoKnown');
      });
    });
  });
});

describe('toExposureInfo', () => {
  describe('when there are no exposure notifications', () => {
    it('returns an empty ExposureInfo', () => {
      const rawExposures: RawExposure[] = [];

      const result = toExposureInfo(rawExposures);

      expect(result).toEqual({});
    });
  });

  describe('when there was a possible exposure two days ago', () => {
    it('returns an ExposureInfo with a PossibleExposure at the correct date', () => {
      const today = Date.now();
      const twoDaysAgo = dayjs(today).subtract(2, 'day').valueOf();
      const beginningOfTwoDaysAgo = DateTimeUtils.beginningOfDay(twoDaysAgo);
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

      const result = toExposureInfo(rawExposures);

      expect(Object.keys(result).length).toEqual(1);
      expect(result[beginningOfTwoDaysAgo]).toEqual(expected);
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

      const result = toExposureInfo(rawExposures);

      expect(result[beginningOfDay]).toEqual(expected);
    });
  });
});
