/**
 * Intersect a set of points against the user's locally stored points.
 *
 * MVP1 implementation
 *  - hashed data points and thresholds
 */

import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import { NativeModules } from 'react-native';
import PushNotification from 'react-native-push-notification';
import getCursor from '../api/healthcareAuthorities/getCursorApi';
import {
  DEFAULT_CONCERN_TIME_FRAME_MINUTES,
  DEFAULT_THRESHOLD_MATCH_PERCENT,
  MAX_EXPOSURE_WINDOW_DAYS,
} from '../constants/history';
import {
  AUTHORITY_SOURCE_SETTINGS,
  CROSSED_PATHS,
  DEBUG_MODE,
} from '../constants/storage';
import { GetStoreData, SetStoreData } from '../helpers/General';
import languages from '../locales/languages';
import { MIN_LOCATION_UPDATE_MS } from '../services/LocationService';
import StoreAccessor from '../store/StoreAccessor';
import { isPlatformiOS } from './../Util';

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

// rounds the number of milliseconds to nearest valid exposure period
function roundExposure(diffMS, gpsPeriodMS) {
  return Math.round(diffMS / gpsPeriodMS) * gpsPeriodMS;
}

/**
 * Kicks off the intersection process.  Immediately returns after starting the
 * background intersection.  Typically would be run about every 12 hours, but
 * but might get run more frequently, e.g. when the user changes authority settings
 *
 * TODO: This call kicks off the intersection, as well as getting basic info
 *        from the authority (e.g. the news url) since we get that in the same call.
 *        Ideally those should probably be broken up better, but for now leaving it alone.
 */
export async function checkIntersect(healthcareAuthorities) {
  console.log(
    `[intersect] tick entering on ${isPlatformiOS() ? 'iOS' : 'Android'}; `,
  );
  const result = await asyncCheckIntersect(healthcareAuthorities);
  return result;
}

/**
 * Async run of the intersection.  Also saves off the news sources that the authorities specified,
 *    since that comes from the authorities in the same download.
 *
 * Returns the array of day bins (mostly for debugging purposes)
 */
async function asyncCheckIntersect(healthcareAuthorities) {
  const gpsPeriodMS = MIN_LOCATION_UPDATE_MS;

  let { locationArray, dayBins } = await getTransformedLocalDataAndDayBins(
    gpsPeriodMS,
  );

  // we also need locally saved data so we can know the last read page for each HA
  let localHAData = await GetStoreData(AUTHORITY_SOURCE_SETTINGS, false);
  if (!localHAData) localHAData = [];

  const store = StoreAccessor.getStore();

  if (store === null) {
    throw Error.new(
      'Attempting to access a not set store checking for intersect',
    );
  }

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
  return dayBins;
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

  for (const page of pages) {
    if (!page.id) {
      // skip this page
      continue;
    }
    const concernPointsPage = await getPageData(authority, page);

    if (
      concernPointsPage.concern_point_hashes &&
      Array.isArray(concernPointsPage.concern_point_hashes)
    ) {
      // check if any of local points hashes are contained in this page
      updateMatchFlags(
        locationArray,
        new Set(concernPointsPage.concern_point_hashes),
      );
    }

    currHA.cursor = `${page.startTimestamp}_${page.endTimestamp}`;
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

async function getPageData(authority, page) {
  // this function should always return an object.
  // if there's no data, return an empty object.
  const cacheKey = authority.internal_id + '|page:' + page.id;
  let pageData = await GetStoreData(cacheKey, false);
  if (!pageData && (await shouldDownloadPageData())) {
    try {
      pageData = await retrieveUrlAsJson(page.filename);
      SetStoreData(cacheKey, pageData);
    } catch (e) {
      // sometimes the url isn't right, the download will fail
      console.log(
        'error occurred while downloading ha page',
        authority.name,
        page.id,
        e,
      );
    }
  }
  return pageData || {};
}

async function shouldDownloadPageData() {
  const store = StoreAccessor.getStore();

  if (store === null) {
    throw Error.new(
      'Attempting to access a not set store checking for intersect',
    );
  }

  const reduxState = store.getState();
  if (
    reduxState &&
    reduxState.settings &&
    reduxState.settings.downloadLargeDataOverWifiOnly
  ) {
    const connectionState = await NetInfo.fetch();
    if (connectionState.type !== NetInfoStateType.wifi) {
      // if user decides to only use wifi, don't download if not connected to wifi
      return false;
    }
  }
  return true;
}
