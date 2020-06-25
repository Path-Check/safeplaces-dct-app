import dayjs from 'dayjs';

import { DateTimeUtils } from './helpers';
import {
  calendarDays,
  toExposureHistory,
  ExposureDatum,
  ExposureInfo,
} from './exposureHistory';

describe('toExposureHistory', () => {
  describe('when given a 21 day calendar', () => {
    describe('when given an ExposureInfo with no exposures', () => {
      it('it returns a 21 day history of NoKnown Exposures', () => {
        const today = dayjs('2020-06-26').valueOf();
        const calendar = calendarDays(today, 21);
        const exposureInfo: ExposureInfo = {};

        const result = toExposureHistory(exposureInfo, calendar);

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
        const calendar = calendarDays(today, 21);

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

        const result = toExposureHistory(exposureInfo, calendar);

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

describe('calendarDays', () => {
  describe('when today is monday and 21 days are requested', () => {
    it('returns a list of 21 consecutive days, ending at the next saturday', () => {
      const monday = dayjs('2020-06-22').valueOf();

      const result = calendarDays(monday, 21);

      const lastDay = result[result.length - 1];
      const firstDay = result[0];
      expect(result.length).toBe(21);
      expect(posixToString(lastDay)).toBe('2020-06-27');
      expect(posixToString(firstDay)).toBe('2020-06-07');
    });
  });

  describe('when today is saturday and 21 days are requested', () => {
    it('returns a list of 21 consecutive days, ending on today', () => {
      const saturday = dayjs('2020-06-27').valueOf();

      const result = calendarDays(saturday, 21);

      const lastDay = result[result.length - 1];
      const firstDay = result[0];
      expect(result.length).toBe(21);
      expect(posixToString(lastDay)).toBe('2020-06-27');
      expect(posixToString(firstDay)).toBe('2020-06-07');
    });
  });
});

const posixToString = (date: DateTimeUtils.Posix): string => {
  return dayjs(date).format('YYYY-MM-DD');
};
