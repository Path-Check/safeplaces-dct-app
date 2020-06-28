/**
 * Intersect a set of points against the user's locally stored points.
 *
 * MVP1 implementation
 *  - hashed data points and thresholds
 */

import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import { NativeModules } from 'react-native';
import PushNotification from 'react-native-push-notification';

import { isPlatformiOS } from './../Util';
import {
  DEFAULT_CONCERN_TIME_FRAME_MINUTES,
  DEFAULT_THRESHOLD_MATCH_PERCENT,
  MAX_EXPOSURE_WINDOW_DAYS,
  MIN_CHECK_INTERSECT_INTERVAL,
} from '../constants/history';
import {
  AUTHORITY_SOURCE_SETTINGS,
  CROSSED_PATHS,
  LAST_CHECKED,
  LOCATION_DATA,
} from '../constants/storage';
import { DEBUG_MODE } from '../constants/storage';
import {
  GetStoreData,
  RemoveStoreData,
  SetStoreData,
} from '../helpers/General';
import { MIN_LOCATION_UPDATE_MS } from '../services/LocationService';
import languages from '../locales/languages';

import { store } from '../store';

import getCursor from '../api/healthcareAuthorities/getCursorApi';

/**
 * Performs "safety" cleanup of the data, to help ensure that we actually have location
 *   data in the array.  Also fixes cases with extra info or values coming in as strings.
 *
 * @param {array} arr - array of locations in JSON format
 */
export function normalizeAndSortLocations(arr) {
  // This fixes several issues that I found in different input data:
  //   * Values stored as strings instead of numbers
  //   * Extra info in the input
  //   * Improperly sorted data (can happen after an Import)
  let result = [];

  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      let elem = arr[i];
      if (
        'time' in elem &&
        'latitude' in elem &&
        'longitude' in elem &&
        'hashes' in elem
      ) {
        result.push({
          time: Number(elem.time),
          latitude: Number(elem.latitude),
          longitude: Number(elem.longitude),
          hashes: elem.hashes,
        });
      }
    }

    result.sort((a, b) => a.time - b.time);
  }
  return result;
}

/**
 * Returns an array of data points within the exposure window
 *
 * @param {array} localDataPoints
 * @param {int} exposureWindowDays
 */
export function discardOldData(
  localDataPoints = [],
  exposureWindowDays = MAX_EXPOSURE_WINDOW_DAYS,
) {
  dayjs.extend(dayOfYear);
  const todayDOY = dayjs().dayOfYear();
  const firstValid = localDataPoints.findIndex(
    (ldp) => todayDOY - dayjs(ldp.time).dayOfYear() < exposureWindowDays,
  );
  return localDataPoints.slice(firstValid, localDataPoints.length);
}

/**
 * Returns an array with <exposureWindowDays> elements.
 * The elements have a value of -1 if there are no local
 * data points for that day, otherwise zero.
 *
 * This method should be called before filling the gaps
 * in the local points data because the filled data would
 * generate the same result as filling day bins with zeros.
 *
 * @param {array} localDataPoints
 * @param {int} exposureWindowDays
 */
export function initLocationBins(
  exposureWindowDays = MAX_EXPOSURE_WINDOW_DAYS,
  localDataPoints = [],
) {
  dayjs.extend(dayOfYear);
  const todayDOY = dayjs().dayOfYear();
  const dayBins = new Array(exposureWindowDays).fill(-1);

  for (let ldp of localDataPoints) {
    const daysAgo = todayDOY - dayjs(ldp.time).dayOfYear();
    if (dayBins[daysAgo] === 0 || daysAgo >= exposureWindowDays) continue;
    dayBins[daysAgo] = 0;
  }
  return dayBins;
}

/**
 * Returns an array that consists all elements from <localData> array,
 * with elements inserted between two local data points if there is a time gap
 * larger than <gpsPeriodMS>.
 *
 * The number of elements inserted between two elements is one less
 * than the number of gps periods that ocurred between the two points.
 *
 * @param {array} localData - array of stored gps points with gaps
 * @param {int} gpsPeriodMS - local points sampling period
 */
export function fillLocationGaps(
  localData,
  gpsPeriodMS = MIN_LOCATION_UPDATE_MS,
) {
  // helper function that creates and populates an array with correct timestamps
  const generateGapPoints = (startTime, gapSize, gpsPeriodMS) =>
    [...new Array(gapSize)].map((_, i) => ({
      time: startTime + (i + 1) * gpsPeriodMS,
      hashes: [],
    }));

  const filled = [];
  for (let i = 0; i < localData.length; i++) {
    filled.push(localData[i]);

    if (i === localData.length - 1) continue;
    // gap size is the amount of additional gps sampling periods
    // that can fit in the interval between two local data points
    const interval = dayjs(localData[i + 1].time).diff(localData[i].time);
    const gapSize = Math.round(interval / gpsPeriodMS) - 1;
    if (gapSize > 0) {
      // generate missing data points with correct times
      filled.push(
        ...generateGapPoints(localData[i].time, gapSize, gpsPeriodMS),
      );
    }
  }

  return filled;
}

const getTransformedLocalDataAndDayBins = async (gpsPeriodMS) => {
  // get the saved set of locations for the user, already sorted, and fill in the gaps
  const locationArray = await NativeModules.SecureStorageManager.getLocations();
  const locationArrayWithoutOldData = discardOldData(
    locationArray,
    MAX_EXPOSURE_WINDOW_DAYS,
  );
  const locationArrayWithoutGaps = fillLocationGaps(
    locationArrayWithoutOldData,
    gpsPeriodMS,
  );
  // generate an array with the asked number of day bins
  const dayBins = initLocationBins(
    MAX_EXPOSURE_WINDOW_DAYS,
    locationArrayWithoutOldData,
  );

  return {
    locationArray: locationArrayWithoutGaps,
    dayBins,
  };
};

/**
 * Updates the `hasMatch` flag of recorded GPS data points
 * that are in the HA's list of concern points.
 *
 * This method does not calculate the exposure durations,
 * as that can be done only after all of the HA data chunks
 * have been analyzed.
 *
 * @param {array} localGPSDataPoints - array of recorded GPS data points.
 * @param {Set} concernPointHashes - set of hashed concern points issued by health authorities
 */
export function updateMatchFlags(localGPSDataPoints, concernPointHashes) {
  // iterate over recorded GPS data points
  for (const dataPoint of localGPSDataPoints) {
    // check if any of hashes in this GPS data point is contained in the HA's list of concern points
    const hasCrossedPaths = dataPoint.hashes.some((h) =>
      concernPointHashes.has(h),
    );
    if (hasCrossedPaths) {
      // paths crossed, set match flag
      dataPoint.hasMatch = true;
    }
  }
}

/**
 * Calculates the exposure durations for each day
 *
 * @param {array} localGPSDataPoints - array of recorded GPS data points.
 * @param {int} numDayBins - (optional) number of bins in the array returned
 * @param {int} concernTimeWindowMS - (optional) window of time to use when determining an exposure
 * @param {int} defaultExposurePeriodMS - (optional) the default exposure period to use when necessary when an exposure is found
 */
export function fillDayBins(
  dayBins,
  localGPSDataPoints,
  concernTimeFrameMS = DEFAULT_CONCERN_TIME_FRAME_MINUTES * 60e3,
  thresholdMatchPercent = DEFAULT_THRESHOLD_MATCH_PERCENT,
  gpsPeriodMS = MIN_LOCATION_UPDATE_MS,
) {
  // skip the intersection calculation if there are no local data points
  if (!localGPSDataPoints.length) return dayBins;

  dayjs.extend(dayOfYear);
  // number of data points that fit in the time frame
  const pointsInFrame = Math.ceil(concernTimeFrameMS / gpsPeriodMS);
  // number of matches in time frame for it to be considered as an exposure period
  const thresholdMatches = Math.ceil(pointsInFrame * thresholdMatchPercent);

  // for each element, calculate the number of matches that ocurred up until that element
  let matchCount = 0;
  const prevMatchCounts = localGPSDataPoints.map((p) =>
    p.hasMatch ? matchCount++ : matchCount,
  ); // make an array of matches up until that data point
  prevMatchCounts.push(matchCount); // as the name states, prevMatchCounts[index] is the number of matches
  // in previous index elements, so we add one more that tells us the total num of matches

  // array of exposures, each exposure is an object of shape
  // { start (inclusive) , end (non-inclusive) }.
  const exposures = [];
  let currExposure = null;
  // slide the time frame over recorded data points
  for (
    let i = 0, j = i + pointsInFrame;
    j <= localGPSDataPoints.length;
    i++, j++
  ) {
    // if the current exposure ended and the frame advanced, clear old exposure
    if (currExposure && currExposure.end < i) {
      currExposure = null;
    }

    // skip if curr data point doesn't have a match
    // or the match count in this frame is smaller than the threshold
    if (
      localGPSDataPoints[i].hasMatch &&
      prevMatchCounts[j] - prevMatchCounts[i] >= thresholdMatches
    ) {
      if (currExposure) {
        // if there is an active exposure, extend it (non-inclusively)
        currExposure.end = j;
      } else {
        // if there isn't - create it and add it to the list
        currExposure = { start: i, end: j };
        exposures.push(currExposure);
      }
    }
  }

  const todayDOY = dayjs().dayOfYear();

  // and now, finally, we can fill the day bins based on calculated exposure periods
  for (let exposure of exposures) {
    const startTime = dayjs(localGPSDataPoints[exposure.start].time);
    const endTime = dayjs(localGPSDataPoints[exposure.end - 1].time);

    const daysAgoStart = todayDOY - dayjs(startTime).dayOfYear();
    const daysAgoEnd = todayDOY - dayjs(endTime).dayOfYear();

    // difference in days between start and end
    // NOTE: in "days ago", the start day is bigger or same as the end day
    const dayDiff = daysAgoStart - daysAgoEnd;

    if (dayDiff === 0) {
      // if the start and end of the exposure happened on the same day
      // we can subtract the indices of data points
      // and easily calculate exposure length
      const duration = (exposure.end - exposure.start) * gpsPeriodMS;
      // accumulate the calculated duration
      dayBins[daysAgoStart] += duration;
    } else {
      // exposure spans across two or more days, iterate over each
      // logic here is kinda backwards, as the indices mean "days ago"
      for (let daysAgo = daysAgoStart; daysAgo >= daysAgoEnd; daysAgo--) {
        if (daysAgo === daysAgoStart) {
          // for the first day, calc from start time to midnight
          const midnight = startTime.clone().endOf('day');
          dayBins[daysAgo] += roundExposure(
            midnight.diff(startTime),
            gpsPeriodMS,
          );
        } else if (daysAgo === daysAgoEnd) {
          // for the last day, calc from midnight to end time
          const midnight = endTime.clone().startOf('day');
          dayBins[daysAgo] += roundExposure(
            endTime.diff(midnight) + gpsPeriodMS,
            gpsPeriodMS,
          );
        } else {
          // otherwise, it's a full day exposure
          dayBins[daysAgo] = 24 * 60 * 60e3;
        }
      }
    }
  }

  return dayBins;
}

const transformDayBinsToExposureInfo = (dayBins) => {
  return dayBins.reduce((ei, duration, index) => {
    const startOfDayAgo = dayjs()
      .startOf('day')
      .subtract(index, 'day')
      .valueOf();
    ei[startOfDayAgo] =
      duration > 0
        ? {
            kind: 'Possible',
            date: startOfDayAgo,
            duration: duration,
            totalRiskScore: 0,
            transmissionRiskLevel: 0,
          }
        : {
            kind: 'NoKnown',
            date: startOfDayAgo,
          };

    return ei;
  }, {});
};

// rounds the number of milliseconds to nearest valid exposure period
function roundExposure(diffMS, gpsPeriodMS) {
  return Math.round(diffMS / gpsPeriodMS) * gpsPeriodMS;
}

/**
 * Migrates the old GPS data into secure storage (Realm)
 *
 * @returns {Promise<boolean>} Boolean for whether there was any data to migrate
 */
export async function migrateOldData() {
  const locations = await GetStoreData(LOCATION_DATA, false);

  if (Array.isArray(locations) && locations.length > 0) {
    await NativeModules.SecureStorageManager.migrateExistingLocations(
      locations,
    );
    await RemoveStoreData(LOCATION_DATA);
    return true; // data was migrated
  }
  return false; // nothing to migrate
}

/** The old data has been migrated already for this session/app. */
let hasMigratedOldData = false;

/**
 * Kicks off the intersection process.  Immediately returns after starting the
 * background intersection.  Typically would be run about every 12 hours, but
 * but might get run more frequently, e.g. when the user changes authority settings
 *
 * TODO: This call kicks off the intersection, as well as getting basic info
 *        from the authority (e.g. the news url) since we get that in the same call.
 *        Ideally those should probably be broken up better, but for now leaving it alone.
 */
export async function checkIntersect(
  healthcareAuthorities,
  bypassTimer = false,
) {
  console.log(
    `[intersect] tick entering on ${isPlatformiOS() ? 'iOS' : 'Android'}; `,
    `is bypassing timer = ${bypassTimer}`,
  );

  // TODO: remove this after June 1 once 14 day old history is irrelevant
  if (!hasMigratedOldData) {
    await migrateOldData();
    hasMigratedOldData = true;
  }

  const result = await asyncCheckIntersect(healthcareAuthorities, bypassTimer);
  console.log(`[intersect] ${result ? 'completed' : 'skipped'}`);
  return result;
}

/**
 * Async run of the intersection.  Also saves off the news sources that the authorities specified,
 *    since that comes from the authorities in the same download.
 *
 * Returns the array of day bins (mostly for debugging purposes)
 */
async function asyncCheckIntersect(healthcareAuthorities, bypassTimer = false) {
  // first things first ... is it time to actually try the intersection?
  let lastCheckedMs = Number(await GetStoreData(LAST_CHECKED));
  if (
    !bypassTimer &&
    lastCheckedMs + MIN_CHECK_INTERSECT_INTERVAL * 60e3 > dayjs().valueOf()
  ) {
    return null;
  }

  const gpsPeriodMS = MIN_LOCATION_UPDATE_MS;

  let { locationArray, dayBins } = await getTransformedLocalDataAndDayBins(
    gpsPeriodMS,
  );

  // we also need locally saved data so we can know the last read page for each HA
  let localHAData = await GetStoreData(AUTHORITY_SOURCE_SETTINGS, false);
  if (!localHAData) localHAData = [];

  let selectedAuthorities = healthcareAuthorities
    ? healthcareAuthorities
    : ({
        healthcareAuthorities: { selectedAuthorities },
      } = store.getState());

  for (const authority of selectedAuthorities) {
    try {
      dayBins = await performIntersectionForSingleHA(
        authority,
        localHAData,
        locationArray,
        dayBins,
        gpsPeriodMS,
      );
    } catch (error) {
      // TODO: We silently fail.  Could be a JSON parsing issue, could be a network issue, etc.
      //       Should do better than this.
      console.log('[authority] fetch/parse error :', error);
    } finally {
      //
    }
  }

  // if any of the bins are > 0, tell the user
  if (dayBins.some((a) => a > 0)) notifyUserOfRisk();

  // store the results
  SetStoreData(CROSSED_PATHS, dayBins); // TODO: Store per authority?

  // store updated cursors
  SetStoreData(AUTHORITY_SOURCE_SETTINGS, localHAData);

  // save off the current time as the last checked time
  let unixTimeUTC = dayjs().valueOf();
  SetStoreData(LAST_CHECKED, unixTimeUTC);

  return transformDayBinsToExposureInfo(dayBins);
}

const performIntersectionForSingleHA = async (
  authority,
  localHAData,
  locationArray,
  oldDayBins,
  gpsPeriodMS,
) => {
  let {
    name,
    api_endpoint_url,
    info_website_url,
    notification_threshold_percent,
    notification_threshold_timeframe,
    pages,
  } = await getCursor(authority);

  let currHA = localHAData.find((ha) => ha.key === name);
  if (!currHA) {
    currHA = {
      key: name,
      url: info_website_url,
      cursor: '',
    };
    localHAData.push(currHA);
  }

  for (const { startTimestamp, endTimestamp, filename } of pages) {
    // fetch non-analyzed page
    const pageURL = `${api_endpoint_url}${filename}`;
    const concernPointsPage = await retrieveUrlAsJson(pageURL);

    // check if any of local points hashes are contained in this page
    updateMatchFlags(
      locationArray,
      new Set(concernPointsPage.concern_point_hashes),
    );

    currHA.cursor = `${startTimestamp}_${endTimestamp}`;
  }

  const timeFrameMS = notification_threshold_timeframe * 60e3;
  const matchRate = notification_threshold_percent / 100;

  return fillDayBins(
    oldDayBins,
    locationArray,
    timeFrameMS,
    matchRate,
    gpsPeriodMS,
  );
};

/**
 * Notify the user that they are possibly at risk
 */
function notifyUserOfRisk() {
  PushNotification.localNotification({
    title: languages.t('label.push_at_risk_title'),
    message: languages.t('label.push_at_risk_message'),
  });
}

/**
 * Return Json retrieved from a URL
 *
 * @param {string} url
 */
async function retrieveUrlAsJson(url) {
  let response = await fetch(url);
  if (response.ok) return response.json();
}

/** Set the app into debug mode */
export function enableDebugMode() {
  SetStoreData(DEBUG_MODE, 'true');

  // Create faux intersection data
  let pseudoBin = [];
  for (let i = 0; i < MAX_EXPOSURE_WINDOW_DAYS; i++) {
    let intersections =
      Math.max(0, Math.floor(Math.random() * 50 - 20)) * 60 * 1000; // in milliseconds
    if (intersections == 0 && Math.random() < 0.3) intersections = -1; // about 30% of negative will be set as no data
    pseudoBin.push(intersections);
  }
  let dayBin = JSON.stringify(pseudoBin);
  console.log(dayBin);
  SetStoreData(CROSSED_PATHS, dayBin);
}

/** Restore the app from debug mode */
export function disableDebugMode() {
  // Wipe faux intersection data
  let pseudoBin = [];
  for (let i = 0; i < MAX_EXPOSURE_WINDOW_DAYS; i++) {
    pseudoBin.push(0);
  }
  let dayBin = JSON.stringify(pseudoBin);
  SetStoreData(CROSSED_PATHS, dayBin);

  SetStoreData(DEBUG_MODE, 'false');

  // Kick off intersection calculations to restore data
  checkIntersect();
}
