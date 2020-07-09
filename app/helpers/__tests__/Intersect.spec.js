import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import MockDate from 'mockdate';

import {
  DEFAULT_EXPOSURE_PERIOD_MINUTES,
  MAX_EXPOSURE_WINDOW_DAYS,
} from '../../constants/history';
import {
  discardOldData,
  fillDayBins,
  fillLocationGaps,
  initLocationBins,
  normalizeAndSortLocations,
  updateMatchFlags,
} from '../Intersect';

// Base moment used in all tests.
// This is SUPER hacky ... it will effectively ensure that tests run near noon (unless otherwise offset)
//
// TODO: Do better than this.  Find something that properly allows for mocking times and timezones (and actually works)
//
const TEST_MOMENT = dayjs('2020-04-17T14:00:00.000Z')
  .startOf('day')
  .add(12, 'hours');

/**
 * locations used in testing.  Set up as a single object to help simplify test setup.
 *      Kansas City, MO, USA
 *      Hammerfest, Norway
 *      Hobart, Tasmania, Australia
 *      Munich, Germany
 *      La Concordia, Costa Rica
 */
const TEST_LOCATIONS = {
  kansascity: {
    base: {
      lat: 39.09772,
      lon: -94.582959,
      hashSeed: 'kansascity_pos_',
    },
    concern: {
      lat: 39.097769,
      lon: -94.582937,
      hashSeed: 'kansascity_pos_',
    },
    no_concern: {
      lat: 39.1,
      lon: -94.6,
      hashSeed: 'kansascity_neg_',
    },
  },
  hammerfest: {
    base: {
      lat: 70.663017,
      lon: 23.682105,
      hashSeed: 'hammerfest_pos_',
    },
    concern: {
      lat: 70.66302,
      lon: 23.6822,
      hashSeed: 'hammerfest_pos_',
    },
    no_concern: {
      lat: 70.662482,
      lon: 23.68115,
      hashSeed: 'hammerfest_neg_',
    },
  },
  hobart: {
    base: {
      lat: -42.8821,
      lon: 147.3272,
      hashSeed: 'hobart_pos_',
    },
    concern: {
      lat: -42.88215,
      lon: 147.32721,
      hashSeed: 'hobart_pos_',
    },
    no_concern: {
      lat: -42.883,
      lon: 147.328,
      hashSeed: 'hobart_neg_',
    },
  },
  munich: {
    base: {
      lat: 48.1351,
      lon: 11.582,
      hashSeed: 'munich_pos_',
    },
    concern: {
      lat: 48.13515,
      lon: 11.58201,
      hashSeed: 'munich_pos_',
    },
    no_concern: {
      lat: 48.136,
      lon: 11.584,
      hashSeed: 'munich_neg_',
    },
  },
  laconcordia: {
    base: {
      lat: 0.01,
      lon: -79.3918,
      hashSeed: 'laconcordia_pos_',
    },
    concern: {
      lat: 0.01005,
      lon: -79.39185,
      hashSeed: 'laconcordia_pos_',
    },
    no_concern: {
      lat: 0.01015,
      lon: -79.3912,
      hashSeed: 'laconcordia_neg_',
    },
  },
};

const DEFAULT_THRESHOLD_MATCH_PERCENT = 0.66;
const DEFAULT_CONCERN_TIMEFRAME_MS = 30 * 60e3;

beforeEach(() => {
  jest.resetAllMocks();
});

describe('calculate exposure durations', () => {
  /**
   *   Intersect tests with empty location sets.  Multiple cases covered.
   */
  describe('intersect with empty sets', () => {
    beforeEach(() => {
      MockDate.set(TEST_MOMENT.valueOf());
    });

    afterEach(() => {
      MockDate.reset();
    });

    /**
     * Simplest case, empty data, should be no results in all bins
     */
    it('empty locations vs empty concern locations has no data result', () => {
      let baseLocations = [];
      let concernHashes = [];

      baseLocations = normalizeAndSortLocations(baseLocations);
      baseLocations = discardOldData(baseLocations);
      let resultBins = initLocationBins(
        MAX_EXPOSURE_WINDOW_DAYS,
        baseLocations,
      );
      baseLocations = fillLocationGaps(
        baseLocations,
        DEFAULT_EXPOSURE_PERIOD_MINUTES * 60e3,
      );
      // check for intersections and update matchflags
      updateMatchFlags(baseLocations, concernHashes);
      // claculate exposure durations
      resultBins = fillDayBins(
        resultBins,
        baseLocations,
        DEFAULT_CONCERN_TIMEFRAME_MS,
        DEFAULT_THRESHOLD_MATCH_PERCENT,
      );

      let expectedBins = initLocationBins(MAX_EXPOSURE_WINDOW_DAYS);

      expect(resultBins).toEqual(expectedBins);
    });

    /**
     * Empty locations, some concern locations
     */
    it('empty locations vs real concern locations has no data result', () => {
      let baseLocations = [];

      // a few concern locations, going back a while
      let concernHashes = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.kansascity.concern,
          TEST_MOMENT.valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hammerfest.concern,
          TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hobart.concern,
          TEST_MOMENT.clone().subtract(7, 'days').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.concern,
          TEST_MOMENT.clone().subtract(10, 'days').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.concern,
          TEST_MOMENT.clone().subtract(17, 'days').valueOf(),
        ).hashes,
      ];

      baseLocations = normalizeAndSortLocations(baseLocations);
      baseLocations = discardOldData(baseLocations);
      const resultBins = initLocationBins(
        MAX_EXPOSURE_WINDOW_DAYS,
        baseLocations,
      );
      baseLocations = fillLocationGaps(
        baseLocations,
        DEFAULT_EXPOSURE_PERIOD_MINUTES * 60e3,
      );
      // check for intersections and update matchflags
      updateMatchFlags(baseLocations, concernHashes);
      // claculate exposure durations
      fillDayBins(
        resultBins,
        baseLocations,
        DEFAULT_CONCERN_TIMEFRAME_MS,
        DEFAULT_THRESHOLD_MATCH_PERCENT,
      );

      let expectedBins = initLocationBins(MAX_EXPOSURE_WINDOW_DAYS);

      expect(resultBins).toEqual(expectedBins);
    });

    /**
     * This checks having locaitons, but the health authority is returning
     *   no locations of concern.  Should get "0" in bins with location data
     */
    it('locations vs empty concern locations has correct concern result', () => {
      // a few base locations, going back a while
      let baseLocations = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.kansascity.base,
          TEST_MOMENT.valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hammerfest.base,
          TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hobart.base,
          TEST_MOMENT.clone().subtract(7, 'days').valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.base,
          TEST_MOMENT.clone().subtract(10, 'days').valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.base,
          TEST_MOMENT.clone().subtract(17, 'days').valueOf(),
        ).locations,
      ];

      // no concern locations
      let concernHashes = [];

      baseLocations = normalizeAndSortLocations(baseLocations);
      baseLocations = discardOldData(baseLocations);
      const resultBins = initLocationBins(
        MAX_EXPOSURE_WINDOW_DAYS,
        baseLocations,
      );
      baseLocations = fillLocationGaps(
        baseLocations,
        DEFAULT_EXPOSURE_PERIOD_MINUTES * 60e3,
      );
      // check for intersections and update matchflags
      updateMatchFlags(baseLocations, new Set(concernHashes));
      // claculate exposure durations
      fillDayBins(
        resultBins,
        baseLocations,
        DEFAULT_CONCERN_TIMEFRAME_MS,
        DEFAULT_THRESHOLD_MATCH_PERCENT,
      );

      let expectedBins = initLocationBins(MAX_EXPOSURE_WINDOW_DAYS);
      expectedBins[0] = 0; // expect 0 (not -1) becuase we have location data for this bin
      expectedBins[3] = 0; // expect 0 (not -1) becuase we have location data for this bin
      expectedBins[7] = 0; // expect 0 (not -1) becuase we have location data for this bin
      expectedBins[10] = 0; // expect 0 (not -1) becuase we have location data for this bin

      expect(resultBins).toEqual(expectedBins);
    });
  });

  /**
   * More realistic tests, where there are locations and concern locations
   */
  describe('intersect at fixed locations and times', () => {
    dayjs.extend(duration);

    beforeEach(() => {
      MockDate.set(TEST_MOMENT.valueOf());
    });

    afterEach(() => {
      MockDate.reset();
    });

    /**
     * Exact matches in the baseLocations and the concernHashes
     */
    it('exact intersect has known result', () => {
      // 5 locations, spread over 17 days.  Note, the final location is over the 14 days that intersect covers
      // using the default location sampling interval of 5 minutes, for each location and time we generate 13 points
      // of backfill data, each 5 minutes apart, spanning across one hour before the given time
      let baseLocations = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.kansascity.base,
          TEST_MOMENT.valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hammerfest.base,
          TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hobart.base,
          TEST_MOMENT.clone().subtract(7, 'days').valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.base,
          TEST_MOMENT.clone().subtract(10, 'days').valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.base,
          TEST_MOMENT.clone().subtract(17, 'days').valueOf(),
        ).locations,
      ];
      // same locations for the concern array, at the same times
      let concernHashes = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.kansascity.concern,
          TEST_MOMENT.valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hammerfest.concern,
          TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hobart.concern,
          TEST_MOMENT.clone().subtract(7, 'days').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.concern,
          TEST_MOMENT.clone().subtract(10, 'days').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.concern,
          TEST_MOMENT.clone().subtract(17, 'days').valueOf(),
        ).hashes,
      ];

      baseLocations = normalizeAndSortLocations(baseLocations);
      baseLocations = discardOldData(baseLocations);
      const resultBins = initLocationBins(
        MAX_EXPOSURE_WINDOW_DAYS,
        baseLocations,
      );
      baseLocations = fillLocationGaps(
        baseLocations,
        DEFAULT_EXPOSURE_PERIOD_MINUTES * 60e3,
      );
      // check for intersections and update matchflags
      updateMatchFlags(baseLocations, new Set(concernHashes));
      // claculate exposure durations
      fillDayBins(
        resultBins,
        baseLocations,
        DEFAULT_CONCERN_TIMEFRAME_MS,
        DEFAULT_THRESHOLD_MATCH_PERCENT,
      );

      let expectedBins = initLocationBins(MAX_EXPOSURE_WINDOW_DAYS);
      // for today, we should get an exposure of 65 minutes.
      // The number of (partially) consecutive matches exceeds the threshold,
      // but the window of exposure can't be extended as those are the last points we analize
      expectedBins[0] = dayjs
        .duration(13 * DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes')
        .asMilliseconds(); // expect 65 minutes
      // for all other days, the exposure duration has to be extended by two more points, lasting 75 minutes.
      // the duration is extended while the number of matches in timeframe exceeds the threshold value.
      // using default value of 30 minutes for timeframe and 66 percent of matches in timeframe
      // for the threshold, we need 4 matches in timeframe to call it an exposure period.
      // If there are any gaps in matches, the exposure might not get extended,
      // as shown in some tests below.
      expectedBins[3] = dayjs
        .duration(15 * DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes')
        .asMilliseconds(); // expect 75 minutes
      expectedBins[7] = dayjs
        .duration(15 * DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes')
        .asMilliseconds(); // expect 75 minutes
      expectedBins[10] = dayjs
        .duration(15 * DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes')
        .asMilliseconds(); // expect 75 minutes

      expect(resultBins).toEqual(expectedBins);
    });

    /**
     * same locations in base and concern sets, but at different times (so no concern)
     */
    it('differing times (nothing in common) shows no concern', () => {
      // 5 locations, spread over 17 days.  Note, the final location is over the 14 days that intersect covers
      let baseLocations = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.kansascity.base,
          TEST_MOMENT.valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hammerfest.base,
          TEST_MOMENT.clone().subtract(3, 'days').valueOf(), // - dayjs.duration(3, 'days').asMilliseconds(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hobart.base,
          TEST_MOMENT.clone().subtract(7, 'days').valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.base,
          TEST_MOMENT.clone().subtract(10, 'days').valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.base,
          TEST_MOMENT.clone().subtract(17, 'days').valueOf(),
        ).locations,
      ];

      // LOOK SHARP ... the locations are in a different order (so at different times)
      let concernHashes = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hammerfest.concern,
          TEST_MOMENT.valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.concern,
          TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.kansascity.concern,
          TEST_MOMENT.clone().subtract(7, 'days').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hobart.concern,
          TEST_MOMENT.clone().subtract(10, 'days').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.concern,
          TEST_MOMENT.clone().subtract(17, 'days').valueOf(),
        ).hashes,
      ];

      baseLocations = normalizeAndSortLocations(baseLocations);
      baseLocations = discardOldData(baseLocations);
      const resultBins = initLocationBins(
        MAX_EXPOSURE_WINDOW_DAYS,
        baseLocations,
      );
      baseLocations = fillLocationGaps(
        baseLocations,
        DEFAULT_EXPOSURE_PERIOD_MINUTES * 60e3,
      );
      // check for intersections and update matchflags
      updateMatchFlags(baseLocations, new Set(concernHashes));
      // claculate exposure durations
      fillDayBins(
        resultBins,
        baseLocations,
        DEFAULT_CONCERN_TIMEFRAME_MS,
        DEFAULT_THRESHOLD_MATCH_PERCENT,
      );

      let expectedBins = initLocationBins(MAX_EXPOSURE_WINDOW_DAYS); // expect no concern time in any of the bins
      expectedBins[0] = 0; // expect 0 (not -1) becuase we have location data for this bin
      expectedBins[3] = 0; // expect 0 (not -1) becuase we have location data for this bin
      expectedBins[7] = 0; // expect 0 (not -1) becuase we have location data for this bin
      expectedBins[10] = 0; // expect 0 (not -1) becuase we have location data for this bin

      expect(resultBins).toEqual(expectedBins);
    });

    /**
     * same general locations and times, but distance apart in each is just over the threshold, so no concern
     */
    it('distances slightly over the threshold shows no concern', () => {
      // 5 locations, spread over 17 days.  Note, the final location is over the 14 days that intersect covers
      let baseLocations = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.kansascity.base,
          TEST_MOMENT.valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hammerfest.base,
          TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hobart.base,
          TEST_MOMENT.clone().subtract(7, 'days').valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.base,
          TEST_MOMENT.clone().subtract(10, 'days').valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.base,
          TEST_MOMENT.clone().subtract(17, 'days').valueOf(),
        ).locations,
      ];

      // same locations for the concern array
      let concernHashes = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.kansascity.no_concern,
          TEST_MOMENT.valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hammerfest.no_concern,
          TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hobart.no_concern,
          TEST_MOMENT.clone().subtract(7, 'days').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.no_concern,
          TEST_MOMENT.clone().subtract(10, 'days').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.no_concern,
          TEST_MOMENT.clone().subtract(17, 'days').valueOf(),
        ).hashes,
      ];

      baseLocations = normalizeAndSortLocations(baseLocations);
      baseLocations = discardOldData(baseLocations);
      const resultBins = initLocationBins(
        MAX_EXPOSURE_WINDOW_DAYS,
        baseLocations,
      );
      baseLocations = fillLocationGaps(
        baseLocations,
        DEFAULT_EXPOSURE_PERIOD_MINUTES * 60e3,
      );
      // check for intersections and update matchflags
      updateMatchFlags(baseLocations, new Set(concernHashes));
      // claculate exposure durations
      fillDayBins(
        resultBins,
        baseLocations,
        DEFAULT_CONCERN_TIMEFRAME_MS,
        DEFAULT_THRESHOLD_MATCH_PERCENT,
      );

      let expectedBins = initLocationBins(MAX_EXPOSURE_WINDOW_DAYS); // expect no concern time in any of the bins
      expectedBins[0] = 0; // expect 0 (not -1) becuase we have location data for this bin
      expectedBins[3] = 0; // expect 0 (not -1) becuase we have location data for this bin
      expectedBins[7] = 0; // expect 0 (not -1) becuase we have location data for this bin
      expectedBins[10] = 0; // expect 0 (not -1) becuase we have location data for this bin

      expect(resultBins).toEqual(expectedBins);
    });

    /**
     * specific test with two locations, with times offset to cross beyond the max offset window,
     * so should be only partial overlaps.
     */
    it('offset in time shows correct partial overlaps ', () => {
      // 2 locations
      let baseLocations = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.base,
          TEST_MOMENT.valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.base,
          TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
        ).locations,
      ];

      // same locations for the concern array, the first is offset back 30 minutes over the offset window, the second
      //   is offset 30 minutes forward
      let concernHashes = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.concern,
          TEST_MOMENT.clone().subtract(30, 'minutes').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.concern,
          TEST_MOMENT.clone().subtract(3, 'days').add(30, 'minutes').valueOf(),
        ).hashes,
      ];

      baseLocations = normalizeAndSortLocations(baseLocations);
      baseLocations = discardOldData(baseLocations);
      const resultBins = initLocationBins(
        MAX_EXPOSURE_WINDOW_DAYS,
        baseLocations,
      );
      baseLocations = fillLocationGaps(
        baseLocations,
        DEFAULT_EXPOSURE_PERIOD_MINUTES * 60e3,
      );
      // check for intersections and update matchflags
      updateMatchFlags(baseLocations, new Set(concernHashes));
      // claculate exposure durations
      fillDayBins(
        resultBins,
        baseLocations,
        DEFAULT_CONCERN_TIMEFRAME_MS,
        DEFAULT_THRESHOLD_MATCH_PERCENT,
      );

      let expectedBins = initLocationBins(MAX_EXPOSURE_WINDOW_DAYS);

      expectedBins[0] = dayjs
        .duration(9 * DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes')
        .asMilliseconds(); // altough the offset is 30 minutes, there are 7 points in that time frame,
      // but we should be able to extend that period by 10 more minutes, giving an overall of 45 minutes
      expectedBins[3] = dayjs
        .duration(9 * DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes')
        .asMilliseconds(); // 45 minutes, same as before

      expect(resultBins).toEqual(expectedBins);
    });

    /**
     * specific test with two locations, and the concern data has multiple matches in the timeframes
     * of concern.  This verifies we're not double counting exposures in this case
     */
    it('is not double counting exposure times with multiple results for a location', () => {
      // 5 locations, spread over 17 days.  Note, the final location is over the 14 days that intersect covers
      let baseLocations = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.base,
          TEST_MOMENT.valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.base,
          TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
        ).locations,
      ];

      // locations with a fair amount of expected overlap
      let concernHashes = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.concern,
          TEST_MOMENT.valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.concern,
          TEST_MOMENT.clone().subtract(3, 'minutes').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.concern,
          TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.concern,
          TEST_MOMENT.clone()
            .subtract(3, 'days')
            .subtract(12, 'minutes')
            .valueOf(),
        ).hashes,
      ];

      baseLocations = normalizeAndSortLocations(baseLocations);
      baseLocations = discardOldData(baseLocations);
      const resultBins = initLocationBins(
        MAX_EXPOSURE_WINDOW_DAYS,
        baseLocations,
      );
      baseLocations = fillLocationGaps(
        baseLocations,
        DEFAULT_EXPOSURE_PERIOD_MINUTES * 60e3,
      );
      // check for intersections and update matchflags
      updateMatchFlags(baseLocations, new Set(concernHashes));
      // claculate exposure durations
      fillDayBins(
        resultBins,
        baseLocations,
        DEFAULT_CONCERN_TIMEFRAME_MS,
        DEFAULT_THRESHOLD_MATCH_PERCENT,
      );

      let expectedBins = initLocationBins(MAX_EXPOSURE_WINDOW_DAYS);

      expectedBins[0] = dayjs
        .duration(13 * DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes')
        .asMilliseconds(); // 3900000 expect 60 minutes + 5 minutes for the final data point that takes the default
      expectedBins[3] = dayjs
        .duration(15 * DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes')
        .asMilliseconds(); // 3900000 expect 70 minutes + 5 minutes for the final data point that takes the default

      expect(resultBins).toEqual(expectedBins);
    });

    /**
     * specific test with two locations, with altered defaults.  more dayBins, shorter backfill times
     */
    it('is counting non-standard intervals correctly', () => {
      // for this test we assume that the global gps sampling period is 4 minutes
      let baseLocations = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.base,
          TEST_MOMENT.valueOf(),
          // we backfill for 64 minutes because it's a multiple of 16
          dayjs.duration(64, 'minutes').asMilliseconds(),
          dayjs.duration(4, 'minutes').asMilliseconds(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.base,
          TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
          dayjs.duration(64, 'minutes').asMilliseconds(),
          dayjs.duration(4, 'minutes').asMilliseconds(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.kansascity.base,
          TEST_MOMENT.clone().subtract(17, 'days').valueOf(),
          dayjs.duration(64, 'minutes').asMilliseconds(),
          dayjs.duration(4, 'minutes').asMilliseconds(),
        ).locations,
      ];

      let concernHashes = [
        // generate half of hashes, threshold over 50% should calc this as 0 exposure
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.laconcordia.concern,
          TEST_MOMENT.valueOf(),
          dayjs.duration(64, 'minutes').asMilliseconds(),
          dayjs.duration(4, 'minutes').asMilliseconds(),
        ).hashes,
        // generate half of hashes, threshold over 50% should calc this as 0 exposure
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.munich.concern,
          TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
          dayjs.duration(64, 'minutes').asMilliseconds(),
          dayjs.duration(8, 'minutes').asMilliseconds(),
        ).hashes,
        // generate quarter of hashes, threshold over 25% should calc this as 0 exposure
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.kansascity.concern,
          TEST_MOMENT.clone().subtract(17, 'days').valueOf(),
          dayjs.duration(64, 'minutes').asMilliseconds(),
          dayjs.duration(16, 'minutes').asMilliseconds(),
        ).hashes,
      ];

      baseLocations = normalizeAndSortLocations(baseLocations);
      baseLocations = discardOldData(baseLocations, 21);
      const resultBins = initLocationBins(21, baseLocations);
      baseLocations = fillLocationGaps(
        baseLocations,
        4 * 60e3, // fill gaps with proper gps intervals
      );
      // check for intersections and update matchflags
      updateMatchFlags(baseLocations, new Set(concernHashes));
      // claculate exposure durations
      fillDayBins(
        resultBins,
        baseLocations,
        32 * 60e3, // 32 minutes time frame, so 8 points in time frame
        26 / 100, // threshold reduced to 26% - more then 2 out of 8 matches for concern
        4 * 60e3, // override gps interval
      );
      let expectedBins = initLocationBins(21);

      expectedBins[0] = dayjs.duration(17 * 4, 'minutes').asMilliseconds();
      expectedBins[3] = dayjs.duration(20 * 4, 'minutes').asMilliseconds();
      expectedBins[17] = 0; // match percent threshold over 25%, no exposure.

      expect(resultBins).toEqual(expectedBins);
    });
  });

  /**
   * These are tests running at interesting times, such as near midnight or at a
   *   daylight savings change.
   *
   * TODO: daylight savings not yet tested
   */
  describe('instersect at interesting times', () => {
    dayjs.extend(duration);

    afterEach(() => {
      MockDate.reset();
    });

    /**
     * Overlaps crossing midnight - should add into two different bins
     */
    it('is counting intersections spanning midnight into the proper bins', () => {
      //
      // TODO: Do better than this way of setting the time
      //
      //  Another SUPER hacky solution.  This ensures that the the datetime evaluation
      //    will for sure appear to be 12:31am when the code executes
      //
      const THIS_TEST_MOMENT = TEST_MOMENT.startOf('day').add(30, 'minutes');
      MockDate.set(THIS_TEST_MOMENT.valueOf());

      // 2 locations ... the time period will span midnight
      let baseLocations = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.kansascity.base,
          THIS_TEST_MOMENT.valueOf(),
        ).locations,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hammerfest.base,
          //TEST_MOMENT_MS - 3 * 24 * 60 * 60 * 1000,
          THIS_TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
        ).locations,
      ];
      // same locations, still spanning midnight
      let concernHashes = [
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.kansascity.concern,
          THIS_TEST_MOMENT.valueOf(),
        ).hashes,
        ...generateBackfillLocationArray(
          TEST_LOCATIONS.hammerfest.concern,
          THIS_TEST_MOMENT.clone().subtract(3, 'days').valueOf(),
        ).hashes,
      ];

      baseLocations = normalizeAndSortLocations(baseLocations);
      baseLocations = discardOldData(baseLocations);
      const resultBins = initLocationBins(
        MAX_EXPOSURE_WINDOW_DAYS,
        baseLocations,
      );
      baseLocations = fillLocationGaps(
        baseLocations,
        DEFAULT_EXPOSURE_PERIOD_MINUTES * 60e3,
      );
      // check for intersections and update matchflags
      updateMatchFlags(baseLocations, new Set(concernHashes));
      // claculate exposure durations
      fillDayBins(
        resultBins,
        baseLocations,
        DEFAULT_CONCERN_TIMEFRAME_MS,
        DEFAULT_THRESHOLD_MATCH_PERCENT,
      );

      let expectedBins = initLocationBins(MAX_EXPOSURE_WINDOW_DAYS);
      expectedBins[0] = dayjs
        .duration(7 * DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes')
        .asMilliseconds(); // expect 30 minutes + 5 minutes for "today"
      expectedBins[1] = dayjs
        .duration(6 * DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes')
        .asMilliseconds(); // expect 30 minutes for "yesterday"
      expectedBins[3] = dayjs
        .duration(9 * DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes')
        .asMilliseconds(); // expect 30 minutes + 5 minutes (same as before)
      expectedBins[4] = dayjs
        .duration(6 * DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes')
        .asMilliseconds(); // expect 30 minutes (same as before)

      expect(resultBins).toEqual(expectedBins);
    });

    // A daylight savings time change should cause either a 23 or 25 hour day.
    // TODO: Once we've figured out a good way to mock the timezone and DST, make this test work
  });

  /**
   * Helper for building up the location arrays
   *
   * @param {*} location
   * @param {*} startTimeMS
   * @param {*} hashSeed
   * @param {*} backfillTimeMS
   * @param {*} backfillIntervalMS
   */
  function generateBackfillLocationArray(
    location,
    startTimeMS,
    backfillTimeMS = 1000 * 60 * 60, // one hour default backfill time
    backfillIntervalMS = 1000 * 60 * 5, // five minutes default gps period
  ) {
    let locations = [];
    let hashes = [];
    for (
      let t = startTimeMS;
      t >= startTimeMS - backfillTimeMS;
      t -= backfillIntervalMS
    ) {
      const hash = `${location.hashSeed}${t}`;
      locations.push({
        time: t,
        latitude: location.lat,
        longitude: location.lon,
        hashes: [hash],
      });
      hashes.push(hash);
    }
    return { locations, hashes };
  }
}); // intersectSetIntoBins
