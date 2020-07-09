import { toExposureHistory } from './exposureHistory';
import { ExposureDatum, ExposureInfo } from '../../exposureHistory';
import dayjs from 'dayjs';

describe('toExposureHistory', () => {
  describe('when given a 21 day calendar', () => {
    describe('when given the DayBins with no exposures', () => {
      it('it returns a 21 day history of NoData Exposures', () => {
        const today = dayjs('2020-06-26').valueOf();
        const exposureInfo: ExposureInfo = {};

        const result = toExposureHistory(exposureInfo, {
          startDate: today,
          totalDays: 21,
        });

        expect(result.length).toBe(21);
        expect(
          result.every((datum: ExposureDatum) => datum.kind === 'NoData'),
        ).toBe(true);
      });
    });

    describe('when given an ExposureInfo with a possible exposure today', () => {
      it('returns an exposure history with the exposures on the correct days', () => {
        const tuesday = dayjs('2020-06-23').valueOf();
        const wednesday = dayjs('2020-06-24').valueOf();
        const friday = dayjs('2020-06-26').valueOf();

        const today = friday;

        const tuesdayExposure: ExposureDatum = {
          kind: 'Possible',
          date: tuesday,
          duration: 600000,
          totalRiskScore: 0,
          transmissionRiskLevel: 0,
        };
        const wednesdayExposure: ExposureDatum = {
          kind: 'NoKnown',
          date: wednesday,
        };
        const fridayExposure: ExposureDatum = {
          kind: 'Possible',
          date: friday,
          duration: 300000,
          totalRiskScore: 0,
          transmissionRiskLevel: 0,
        };

        const exposureInfo: ExposureInfo = {
          [tuesday]: tuesdayExposure,
          [wednesday]: wednesdayExposure,
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
        expect(saturdayResult.kind).toBe('NoData');
      });
    });
  });
});
