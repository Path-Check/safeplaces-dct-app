import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import MockDate from 'mockdate';

import {
  CONCERN_TIME_WINDOW_MINUTES,
  DEFAULT_EXPOSURE_PERIOD_MINUTES,
} from '../../constants/history';
import {
  areLocationsNearby,
  getEmptyLocationBins,
  intersectSetIntoBins,
  normalizeAndSortLocations,
} from '../Intersect';

const TEST_MOMENT_MS = dayjs('2020-04-17T16:00:00.000Z').valueOf();

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
    },
    concern: {
      lat: 39.097769,
      lon: -94.582937,
    },
    no_concern: {
      lat: 39.1,
      lon: -94.6,
    },
  },
  hammerfest: {
    base: {
      lat: 70.663017,
      lon: 23.682105,
    },
    concern: {
      lat: 70.66302,
      lon: 23.6822,
    },
    no_concern: {
      lat: 70.662482,
      lon: 23.68115,
    },
  },
  hobart: {
    base: {
      lat: -42.8821,
      lon: 147.3272,
    },
    concern: {
      lat: -42.88215,
      lon: 147.32721,
    },
    no_concern: {
      lat: -42.883,
      lon: 147.328,
    },
  },
  munich: {
    base: {
      lat: 48.1351,
      lon: 11.582,
    },
    concern: {
      lat: 48.13515,
      lon: 11.58201,
    },
    no_concern: {
      lat: 48.136,
      lon: 11.584,
    },
  },
  laconcordia: {
    base: {
      lat: 0.01,
      lon: -79.3918,
    },
    concern: {
      lat: 0.01005,
      lon: -79.39185,
    },
    no_concern: {
      lat: 0.01015,
      lon: -79.3912,
    },
  },
};

/**
 *   Testing the intersect function.  Multiple cases covered.
 */
describe('intersectSetIntoBins', () => {
  dayjs.extend(duration);

  beforeEach(() => {
    MockDate.set(TEST_MOMENT_MS);
  });

  afterEach(() => {
    MockDate.reset();
  });

  /**
   * Simplest case, empty data
   */
  it('intersect of empty locations produces bins with no intersections', () => {
    let emptyLocations = [];
    let emptyConcernLocations = [];
    let resultBins = intersectSetIntoBins(
      emptyLocations,
      emptyConcernLocations,
    );
    expect(resultBins.every(a => a == -1)).toBe(true);
  });

  /**
   * Exact matches in the baseLocations and the concernLocations
   */
  it('intersect of known location intersections at default intervals has known result', () => {
    // 5 locations, spread over 17 days.  Note, the final location is over the 14 days that intersect covers
    let baseLocations = [
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.kansascity.base,
        TEST_MOMENT_MS,
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.hammerfest.base,
        //TEST_MOMENT_MS - 3 * 24 * 60 * 60 * 1000,
        TEST_MOMENT_MS - dayjs.duration(3, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.hobart.base,
        TEST_MOMENT_MS - dayjs.duration(7, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.munich.base,
        TEST_MOMENT_MS - dayjs.duration(10, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.laconcordia.base,
        TEST_MOMENT_MS - dayjs.duration(17, 'days').asMilliseconds(),
      ),
    ];
    // same locations for the concern array, at the same times
    let concernLocations = [
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.kansascity.concern,
        TEST_MOMENT_MS,
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.hammerfest.concern,
        TEST_MOMENT_MS - dayjs.duration(3, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.hobart.concern,
        TEST_MOMENT_MS - dayjs.duration(7, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.munich.concern,
        TEST_MOMENT_MS - dayjs.duration(10, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.laconcordia.concern,
        TEST_MOMENT_MS - dayjs.duration(17, 'days').asMilliseconds(),
      ),
    ];

    // normalize and sort
    baseLocations = normalizeAndSortLocations(baseLocations);
    concernLocations = normalizeAndSortLocations(concernLocations);

    let resultBins = intersectSetIntoBins(baseLocations, concernLocations);

    let expectedBins = getEmptyLocationBins();
    expectedBins[0] = dayjs.duration(60 + DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes').asMilliseconds(); // 3900000 - expect 60 minutes + 5 minutes for the final data point that takes the default
    expectedBins[3] = dayjs.duration(60 + DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes').asMilliseconds(); // 3900000 - expect 60 minutes + 5 minutes for the final data point that takes the default
    expectedBins[7] = dayjs.duration(60 + DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes').asMilliseconds(); // 3900000 - expect 60 minutes + 5 minutes for the final data point that takes the default
    expectedBins[10] = dayjs.duration(60 + DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes').asMilliseconds(); // 3900000 - expect 60 minutes + 5 minutes for the final data point that takes the default

    expect(resultBins).toEqual(expectedBins);
  });

  /**
   * same locations in base and concern sets, but at different times (so no concern)
   */
  it('intersect of known location intersections at differnt times shows no concern', () => {
    // 5 locations, spread over 17 days.  Note, the final location is over the 14 days that intersect covers
    let baseLocations = [
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.kansascity.base,
        TEST_MOMENT_MS,
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.hammerfest.base,
        TEST_MOMENT_MS - dayjs.duration(3, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.hobart.base,
        TEST_MOMENT_MS - dayjs.duration(7, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.munich.base,
        TEST_MOMENT_MS - dayjs.duration(10, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.laconcordia.base,
        TEST_MOMENT_MS - dayjs.duration(17, 'days').asMilliseconds(),
      ),
    ];
    // LOOK SHARP ... the locations are in a different order (so at different times)
    let concernLocations = [
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.hammerfest.concern,
        TEST_MOMENT_MS,
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.laconcordia.concern,
        TEST_MOMENT_MS - dayjs.duration(3, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.kansascity.concern,
        TEST_MOMENT_MS - dayjs.duration(7, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.hobart.concern,
        TEST_MOMENT_MS - dayjs.duration(10, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.munich.concern,
        TEST_MOMENT_MS - dayjs.duration(17, 'days').asMilliseconds(),
      ),
    ];

    // normalize and sort
    baseLocations = normalizeAndSortLocations(baseLocations);
    concernLocations = normalizeAndSortLocations(concernLocations);

    let resultBins = intersectSetIntoBins(baseLocations, concernLocations);
    let expectedBins = getEmptyLocationBins(); // expect no concern time in any of the bins

    expect(resultBins).toEqual(expectedBins);
  });

  /**
   * same general locations and times, but distance apart in each is just over the threshold, so no concern
   */
  it('intersect of known location intersections with distances slightly over the threshold shows no concern', () => {
    // 5 locations, spread over 17 days.  Note, the final location is over the 14 days that intersect covers
    let baseLocations = [
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.kansascity.base,
        TEST_MOMENT_MS,
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.hammerfest.base,
        TEST_MOMENT_MS - dayjs.duration(3, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.hobart.base,
        TEST_MOMENT_MS - dayjs.duration(7, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.munich.base,
        TEST_MOMENT_MS - dayjs.duration(10, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.laconcordia.base,
        TEST_MOMENT_MS - dayjs.duration(17, 'days').asMilliseconds(),
      ),
    ];

    // same locations for the concern array
    let concernLocations = [
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.hammerfest.no_concern,
        TEST_MOMENT_MS,
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.laconcordia.no_concern,
        TEST_MOMENT_MS - dayjs.duration(3, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.kansascity.no_concern,
        TEST_MOMENT_MS - dayjs.duration(7, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.hobart.no_concern,
        TEST_MOMENT_MS - dayjs.duration(10, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.munich.no_concern,
        TEST_MOMENT_MS - dayjs.duration(17, 'days').asMilliseconds(),
      ),
    ];

    // normalize and sort
    baseLocations = normalizeAndSortLocations(baseLocations);
    concernLocations = normalizeAndSortLocations(concernLocations);

    let resultBins = intersectSetIntoBins(baseLocations, concernLocations);
    let expectedBins = getEmptyLocationBins(); // expect no concern time in any of the bins

    expect(resultBins).toEqual(expectedBins);
  });

  /**
   * specific test with two locations, with times offset to cross beyond the max offset window,
   * so should be only partial overlaps.
   */
  it('intersect of known location intersections offset in time show correct partial overlaps ', () => {
    // 2 locations
    let baseLocations = [
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.laconcordia.base,
        TEST_MOMENT_MS,
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.munich.base,
        TEST_MOMENT_MS - dayjs.duration(3, 'days').asMilliseconds(),
      ),
    ];

    // same locations for the concern array, the first is offset back 30 minutes over the offset window, the second
    //   is offset 30 minutes forward
    let concernLocations = [
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.laconcordia.concern,
        TEST_MOMENT_MS -
          dayjs
            .duration(CONCERN_TIME_WINDOW_MINUTES, 'minutes')
            .asMilliseconds() -
          dayjs.duration(30, 'minutes').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.munich.concern,
        TEST_MOMENT_MS -
          dayjs.duration(3, 'days').asMilliseconds() +
          dayjs.duration(30, 'minutes').asMilliseconds(),
      ),
    ];

    // normalize and sort
    baseLocations = normalizeAndSortLocations(baseLocations);
    concernLocations = normalizeAndSortLocations(concernLocations);

    let resultBins = intersectSetIntoBins(baseLocations, concernLocations);
    let expectedBins = getEmptyLocationBins();

    expectedBins[0] = dayjs.duration(30 + DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes').asMilliseconds(); // 2100000 - expect 30 minutes + 5 minutes for the final data point that takes the default
    expectedBins[3] = dayjs.duration(30 + DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes').asMilliseconds(); // expect 30 minutes + 5 minutes for the final data point that takes the default

    console.log('[test]', resultBins, ' ', expectedBins);

    //expect(resultBins.every((value, i) => value == expectedBins[i])).toBe(true);
    expect(resultBins).toEqual(expectedBins);
  });

  /**
   * specific test with two locations, and the concern data has multiple matches in the timeframes
   * of concern.  This verifies we're not double counting exposures in this case
   */
  it('intersect is not double counting exposure times with multiple results for a location', () => {
    // 5 locations, spread over 17 days.  Note, the final location is over the 14 days that intersect covers
    let baseLocations = [
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.laconcordia.base,
        TEST_MOMENT_MS,
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.munich.base,
        TEST_MOMENT_MS - dayjs.duration(3, 'days').asMilliseconds(), // 3 * 24 * 60 * 60 * 1000,
      ),
    ];

    // locations with a fair amount of expected overlap
    let concernLocations = [
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.laconcordia.concern,
        TEST_MOMENT_MS,
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.laconcordia.concern,
        TEST_MOMENT_MS - dayjs.duration(3, 'minutes').asMilliseconds(), // same location, data offset by 3 minutes (so lots of duplicates)
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.munich.concern,
        TEST_MOMENT_MS - dayjs.duration(3, 'days').asMilliseconds(), //  3 * 24 * 60 * 60 * 1000,
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.munich.concern,
        TEST_MOMENT_MS -
          dayjs.duration(3, 'days').asMilliseconds() -
          dayjs.duration(12, 'minutes').asMilliseconds(), // 3 * 24 * 60 * 60 * 1000 - 12 * 60 * 1000,
      ),
    ];

    // normalize and sort
    baseLocations = normalizeAndSortLocations(baseLocations);
    concernLocations = normalizeAndSortLocations(concernLocations);

    let resultBins = intersectSetIntoBins(baseLocations, concernLocations);
    let expectedBins = getEmptyLocationBins();

    expectedBins[0] = dayjs.duration(60 + DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes').asMilliseconds(); // 3900000 expect 60 minutes + 5 minutes for the final data point that takes the default
    expectedBins[3] = dayjs.duration(60 + DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes').asMilliseconds(); // 3900000 expect 60 minutes + 5 minutes for the final data point that takes the default

    expect(resultBins).toEqual(expectedBins);
  });

  /**
   * specific test with two locations, with altered defaults.  more dayBins, shorter backfill times
   */
  it('intersect is counting non-standard intervals correctly', () => {
    // 5 locations, spread over 17 days.  Note, the final location is over the 14 days that intersect covers
    let baseLocations = [
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.laconcordia.base,
        TEST_MOMENT_MS,
        dayjs.duration(1, 'hour').asMilliseconds(), // 1000 * 60 * 60  still only 1 hour
        dayjs.duration(4, 'minutes').asMilliseconds(), // 1000 * 60 * 4  backfill interval is 4 minutes
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.munich.base,
        TEST_MOMENT_MS - 3 * 24 * 60 * 60 * 1000,
        dayjs.duration(1, 'hour').asMilliseconds(), // 1000 * 60 * 60  still only 1 hour
        dayjs.duration(15, 'minutes').asMilliseconds(), //1000 * 60 * 15 backfill interval is 15 minutes, or a total of 5 location points
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.kansascity.base,
        TEST_MOMENT_MS - dayjs.duration(17, 'days').asMilliseconds(), // 17 * 24 * 60 * 60 * 1000,
      ),
    ];

    // same locations for the concern array, the first is offset back 30 minutes over the offset window, the second
    //   is offset 30 minutes forward
    let concernLocations = [
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.laconcordia.concern,
        TEST_MOMENT_MS,
        dayjs.duration(1, 'hour').asMilliseconds(), // 1000 * 60 * 60  still only 1 hour
        dayjs.duration(1, 'minutes').asMilliseconds(), //1000 * 60 * 1 backfill interval is 1 minute
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.munich.concern,
        TEST_MOMENT_MS - dayjs.duration(3, 'days').asMilliseconds(),
      ),
      ...generateBackfillLocationArray(
        TEST_LOCATIONS.kansascity.concern,
        TEST_MOMENT_MS - dayjs.duration(17, 'days').asMilliseconds(), // 17 * 24 * 60 * 60 * 1000,
      ),
    ];

    // normalize and sort
    baseLocations = normalizeAndSortLocations(baseLocations);
    concernLocations = normalizeAndSortLocations(concernLocations);

    let resultBins = intersectSetIntoBins(
      baseLocations,
      concernLocations,
      21, // override to 21 dayBins
      dayjs.duration(CONCERN_TIME_WINDOW_MINUTES, 'minutes').asMilliseconds(), // setting the concern time window
      dayjs
        .duration(DEFAULT_EXPOSURE_PERIOD_MINUTES + 1, 'minutes')
        .asMilliseconds(), //override the exposure period to 1 minute longer that the default
    );
    let expectedBins = getEmptyLocationBins(21);

    expectedBins[0] = dayjs.duration(60 + DEFAULT_EXPOSURE_PERIOD_MINUTES + 1, 'minutes').asMilliseconds();   // 3960000 - Should end up counting 66 minutes total at loconcoria (60 minutes, plus the one at the current moment @ the 6 minute default)
    expectedBins[3] = dayjs.duration(6 * DEFAULT_EXPOSURE_PERIOD_MINUTES, 'minutes').asMilliseconds();   // 5 * 6 * 60 * 1000; // Should end up counting 30 minutes exposure for munich (5 exposures, 6 minutes each)
    expectedBins[17] = dayjs.duration(60 + DEFAULT_EXPOSURE_PERIOD_MINUTES + 1, 'minutes').asMilliseconds();   // 3960000 - Should end up counting 66 minutes total at kansascity (60 minutes, plus the one at the current moment @ the 6 minute default)

    expect(resultBins).toEqual(expectedBins);
  });
});

/**
 * Simple tests for the areLocationsNearby function
 */
describe('areLocationsNearby', () => {
  /**
   * test that north and south poles are far apart!
   */
  it('north and south poles not nearby', () => {
    expect(areLocationsNearby(90, 0, -90, 0)).toBe(false);
  });

  /**
   * New York and Sydney are far apart too (crossing both the equator and date line)
   */
  it('New York and Sydney are not nearby', () => {
    expect(areLocationsNearby(40.7128, -74.006, -33.8688, 151.2093)).toBe(
      false,
    );
  });

  /**
   * Two spots in downtown KC that are with about 15 feet of one another
   */
  it('two spots in Kansas City are nearby', () => {
    expect(
      areLocationsNearby(39.09772, -94.582959, 39.097769, -94.582937),
    ).toBe(true);
  });
});

/**
 * Helper for building up the location arrays
 *
 * @param {*} location
 * @param {*} startTimeMS
 * @param {*} backfillTimeMS
 * @param {*} backfillIntervalMS
 */
function generateBackfillLocationArray(
  location,
  startTimeMS,
  backfillTimeMS = 1000 * 60 * 60,
  backfillIntervalMS = 1000 * 60 * 5,
) {
  let ar = [];
  for (
    let t = startTimeMS;
    t >= startTimeMS - backfillTimeMS;
    t -= backfillIntervalMS
  ) {
    ar.push({ time: t, latitude: location.lat, longitude: location.lon });
  }
  return ar;
}
