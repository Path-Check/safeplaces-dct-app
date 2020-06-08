/**
 * Intersect a set of points against the user's locally stored points.
 *
 * MVP1 implementation
 *  - hashed data points and thresholds
 */

import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import duration from 'dayjs/plugin/duration';
import { NativeModules } from 'react-native';
import PushNotification from 'react-native-push-notification';

import { isPlatformiOS } from './../Util';
import {
  DEFAULT_CONCERN_TIME_FRAME_MINUTES,
  DEFAULT_EXPOSURE_PERIOD_MINUTES,
  DEFAULT_THRESHOLD_MATCH_PERCENT,
  MAX_EXPOSURE_WINDOW_DAYS,
  MIN_CHECK_INTERSECT_INTERVAL,
} from '../constants/history';
import {
  AUTHORITY_NEWS,
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
import languages from '../locales/languages';

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
    dp => todayDOY - dayjs(dp.time).dayOfYear() < exposureWindowDays,
  );
  return localDataPoints.slice(firstValid, localDataPoints.length);
}

/**
 * Returns an array with <exposureWindowDays> elements.
 * The elements have a value of -1 if there are no local
 * data points for that day, otherwise zero.
 *
 * This method should be called before filling the gaps
 * in the local points data becouse the filled data would
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
 * than the number of gps periods that occured between the two points.
 *
 * @param {array} localData - array of stored gps points with gaps
 * @param {int} gpsPeriodMS - local points sampling period
 */
export function fillLocationGaps(localData, gpsPeriodMS) {
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
    const hasCrossedPaths = dataPoint.hashes.some(h =>
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
  concernTimeframeMS = DEFAULT_CONCERN_TIME_FRAME_MINUTES * 60e3,
  thresholdMatchPercent = DEFAULT_THRESHOLD_MATCH_PERCENT,
  gpsPeriodMS = DEFAULT_EXPOSURE_PERIOD_MINUTES * 60e3,
) {
  dayjs.extend(dayOfYear);
  // number of data points that fit in the timeframe
  const pointsInFrame = Math.round(concernTimeframeMS / gpsPeriodMS);
  // number of matches in timeframe for it to be considered as an exposure period
  const thresholdMatches = Math.ceil(pointsInFrame * thresholdMatchPercent);

  // for each element, calculate the number of matches that occured up until that element
  let matchCount = 0;
  const prevMatchCounts = localGPSDataPoints.map(p =>
    p.hasMatch ? matchCount++ : matchCount,
  ); // make an array of matches up until that data point
  prevMatchCounts.push(matchCount); // as the name states, prevMatchCounts[index] is the number of matches
  // in previous index elements, so we add one more that tells us the total num of matches

  // array of exposures, each exposure is an object of shape
  // { start (inclusive) , end (non-inclusive) }.
  const exposures = [];
  let currExposure = null;
  // slide the timeframe over recorded data points
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
          dayBins[daysAgo] = 24 * 60;
        }
      }
    }
  }

  return dayBins;
}

// rounds the number of miliseconds to nearest valid exposure period
function roundExposure(difMS, gpsPeriodMS) {
  return Math.round(difMS / gpsPeriodMS) * gpsPeriodMS;
}

/**
 * Intersects the locationArray with the concernLocationArray, returning the results
 *   as a dayBin array.
 *
 * @param {array} localArray - array of the local locations.  Assumed to have been sorted and normalized
 * @param {array} concernArray - superset array of all concerning points from health authorities.  Assumed to have been sorted and normalized
 * @param {int} numDayBins - (optional) number of bins in the array returned
 * @param {int} concernTimeWindowMS - (optional) window of time to use when determining an exposure
 * @param {int} defaultExposurePeriodMS - (optional) the default exposure period to use when necessary when an exposure is found
 */
export function intersectSetIntoBins(
  localArray,
  concernArray,
  numDayBins = MAX_EXPOSURE_WINDOW_DAYS,
  concernTimeWindowMS = 1000 * 60 * DEFAULT_CONCERN_TIME_FRAME_MINUTES,
  defaultExposurePeriodMS = DEFAULT_EXPOSURE_PERIOD_MINUTES * 60 * 1000,
) {
  // useful for time calcs
  dayjs.extend(duration);

  // generate an array with the asked for number of day bins
  const dayBins = initLocationBins(numDayBins);

  //for (let loc of localArray) {
  for (let i = 0; i < localArray.length; i++) {
    let currentLocation = localArray[i];

    // The current day is 0 days ago (in otherwords, bin 0).
    // Figure out how many days ago the current location was.
    // Note that we're basing this off midnight in the user's current timezone.
    // Also using the dayjs subtract method, which should take timezone and
    //   daylight savings into account.
    let midnight = dayjs().startOf('day');
    let daysAgo = 0;
    while (currentLocation.time < midnight.valueOf() && daysAgo < numDayBins) {
      midnight = midnight.subtract(1, 'day');
      daysAgo++;
    }

    // if this location's date is earlier than the number of days to bin, we can skip it
    if (daysAgo >= numDayBins) continue;

    // Check to see if this is the first exposure for this bin.  If so, reset the exposure time to 0
    // to indicate that we do actually have some data for this day
    if (dayBins[daysAgo] < 0) dayBins[daysAgo] = 0;

    // timeMin and timeMax set from the concern time window
    // These define the window of time that is considered an intersection of concern.
    // The idea is that if this location (lat,lon) is in the concernLocationArray from
    //   the time starting from this location's recorded minus the concernTimeWindow time up
    //   to this locations recorded time, then it is a location of concern.
    let timeMin = currentLocation.time - concernTimeWindowMS;
    let timeMax = currentLocation.time;

    // now find the index in the concernArray that starts with timeMin (if one exists)
    //
    // TODO:  There's probably an optimization that could be done if the locationArray
    //          increased in time only a small amount, since the index we found
    //          in the concernArray is probably already close to where we want to be.
    let j = binarySearchForTime(concernArray, timeMin);
    // we don't really if the exact timestamp wasn't found, so just take the j value as the index to start
    if (j < 0) j = -(j + 1);

    // starting at the now known index that corresponds to the beginning of the
    // location time window, go through all of the concernArray's time-locations
    // to see if there are actually any intersections of concern.  Stop when
    // we get past the timewindow.
    while (j < concernArray.length && concernArray[j].time <= timeMax) {
      if (
        areLocationsNearby(
          concernArray[j].latitude,
          concernArray[j].longitude,
          currentLocation.latitude,
          currentLocation.longitude,
        )
      ) {
        // Crossed path.  Add the exposure time to the appropriate day bin.

        // How long was the possible concern time?
        //    = the amount of time from the current locations time to the next location time
        // or = if that calculated time is not possible or too large, use the defaultExposurePeriodMS
        let exposurePeriod = defaultExposurePeriodMS;
        if (i < localArray.length - 1) {
          let timeWindow = localArray[i + 1].time - currentLocation.time;
          if (timeWindow < defaultExposurePeriodMS * 2) {
            // not over 2x the default, so should be OK
            exposurePeriod = timeWindow;
          }
        }

        // now add the exposure period to the bin
        dayBins[daysAgo] += exposurePeriod;

        // Since we've counted the current location time period, we can now break the loop for
        // this time period and go on to the next location
        break;
      }

      j++;
    }
  }

  return dayBins;
}

/**
 * Function to determine if two location points are "nearby".
 * Uses shortcuts when possible, then the exact calculation.
 *
 * @param {number} lat1 - location 1 latitude
 * @param {number} lon1 - location 1 longitude
 * @param {number} lat2 - location 2 latitude
 * @param {number} lon2 - location 2 longitude
 * @return {boolean} true if the two locations meet the criteria for nearby
 */
export function areLocationsNearby(lat1, lon1, lat2, lon2) {
  let nearbyDistance = 20; // in meters, anything closer is "nearby"

  // these numbers from https://en.wikipedia.org/wiki/Decimal_degrees
  let notNearbyInLatitude = 0.00017966; // = nearbyDistance / 111320
  let notNearbyInLongitude_23Lat = 0.00019518; // = nearbyDistance / 102470
  let notNearbyInLongitude_45Lat = 0.0002541; // = nearbyDistance / 78710
  let notNearbyInLongitude_67Lat = 0.00045981; // = nearbyDistance / 43496

  let deltaLon = lon2 - lon1;

  // Initial checks we can do quickly.  The idea is to filter out any cases where the
  //   difference in latitude or the difference in longitude must be larger than the
  //   nearby distance, since this can be calculated trivially.
  if (Math.abs(lat2 - lat1) > notNearbyInLatitude) return false;
  if (Math.abs(lat1) < 23) {
    if (Math.abs(deltaLon) > notNearbyInLongitude_23Lat) return false;
  } else if (Math.abs(lat1) < 45) {
    if (Math.abs(deltaLon) > notNearbyInLongitude_45Lat) return false;
  } else if (Math.abs(lat1) < 67) {
    if (Math.abs(deltaLon) > notNearbyInLongitude_67Lat) return false;
  }

  // Close enough to do a detailed calculation.  Using the the Spherical Law of Cosines method.
  //    https://www.movable-type.co.uk/scripts/latlong.html
  //    https://en.wikipedia.org/wiki/Spherical_law_of_cosines
  //
  // Calculates the distance in meters
  let p1 = (lat1 * Math.PI) / 180;
  let p2 = (lat2 * Math.PI) / 180;
  let deltaLambda = (deltaLon * Math.PI) / 180;
  let R = 6371e3; // gives d in metres
  let d =
    Math.acos(
      Math.sin(p1) * Math.sin(p2) +
        Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda),
    ) * R;

  // closer than the "nearby" distance?
  if (d < nearbyDistance) return true;

  // nope
  return false;
}

// Basic binary search.  Assumes a sorted array.
function binarySearchForTime(array, targetTime) {
  // Binary search:
  //   array = sorted array
  //   target = search target
  // Returns:
  //   value >= 0,   index of found item
  //   value < 0,    i where -(i+1) is the insertion point
  let i = 0;
  let n = array.length - 1;

  while (i <= n) {
    let k = (n + i) >> 1;
    let cmp = targetTime - array[k].time;

    if (cmp > 0) {
      i = k + 1;
    } else if (cmp < 0) {
      n = k - 1;
    } else {
      // Found exact match!
      // NOTE: Could be one of several if array has duplicates
      return k;
    }
  }
  return -i - 1;
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
export async function checkIntersect() {
  console.log(
    `[intersect] tick entering on ${isPlatformiOS() ? 'iOS' : 'Android'}`,
  );

  // TODO: remove this after June 1 once 14 day old history is irrelevant
  if (!hasMigratedOldData) {
    await migrateOldData();
    hasMigratedOldData = true;
  }

  const result = await asyncCheckIntersect();
  console.log(`[intersect] ${result ? 'completed' : 'skipped'}`);
}

/**
 * Async run of the intersection.  Also saves off the news sources that the authories specified,
 *    since that comes from the authorities in the same download.
 *
 * Returns the array of day bins (mostly for debugging purposes)
 */
async function asyncCheckIntersect() {
  // first things first ... is it time to actually try the intersection?
  let lastCheckedMs = Number(await GetStoreData(LAST_CHECKED));
  if (
    lastCheckedMs + MIN_CHECK_INTERSECT_INTERVAL * 60 * 1000 >
    dayjs().valueOf()
  )
    return null;

  // Fetch previous dayBins for intersections
  let dayBins = await GetStoreData(CROSSED_PATHS);

  // Init the array for the news urls
  let name_news = [];

  const gpsPeriodMS = DEFAULT_EXPOSURE_PERIOD_MINUTES * 60e3;

  // get the saved set of locations for the user, already sorted, and fill in the gaps
  let locationArray = await NativeModules.SecureStorageManager.getLocations();
  locationArray = discardOldData(locationArray, MAX_EXPOSURE_WINDOW_DAYS);
  // generate an array with the asked number of day bins
  let tempDayBins = initLocationBins(MAX_EXPOSURE_WINDOW_DAYS, locationArray);
  locationArray = fillLocationGaps(locationArray, gpsPeriodMS);

  // get the health authorities
  const authorities = await GetStoreData(AUTHORITY_SOURCE_SETTINGS, false);
  const updatedAuthorities = [];

  if (authorities) {
    for (const authority of authorities) {
      // init last read cursor string that is stored with HA data
      let cursor = authority.cursor;
      // start timestamp of the last stored cursor for this HA
      const prevCursorStart = parseTimestampCursor(cursor)[0];

      try {
        let {
          authority_name,
          concern_point_hashes,
          info_website,
          notification_threshold_percent,
          notification_threshold_timeframe,
          pages,
        } = await retrieveUrlAsJson(authority.url);

        // Update the news array with the info from the authority
        name_news.push({
          name: authority_name,
          news_url: info_website,
        });

        for (const page of pages) {
          // skip pages we read before
          if (prevCursorStart > page.startTimestamp) continue;
          // fetch the page we didn't have before
          const concernPointsPage = retrieveUrlAsJson(page.filename);

          // check if any of local points hashes are contained in this page
          updateMatchFlags(
            locationArray,
            new Set(concernPointsPage.concern_point_hashes),
          );

          cursor = `${page.startTimestamp}_${page.endTimestamp}`;
        }

        const timeframeMS = notification_threshold_timeframe * 60e3;
        const matchCoeff = notification_threshold_percent / 100;
        tempDayBins = fillDayBins(
          tempDayBins,
          locationArray,
          timeframeMS,
          matchCoeff,
        );

        // Update each day's bin with the result from the intersection.  To keep the
        //  difference between no data (==-1) and exposure data (>=0), there
        //  are a total of 3 cases to consider.
        dayBins = tempDayBins.map((currentValue, i) => {
          if (currentValue < 0) return dayBins[i];
          if (dayBins[i] < 0) return currentValue;
          return currentValue + dayBins[i];
        });
      } catch (error) {
        // TODO: We silently fail.  Could be a JSON parsing issue, could be a network issue, etc.
        //       Should do better than this.
        console.log('[authority] fetch/parse error :', error);
      }
      // at last, we update the last read cursor for the current HA
      updatedAuthorities.push({ ...authority, cursor });
    }
  }

  // Store the news arary for the authorities found.
  SetStoreData(AUTHORITY_NEWS, name_news);

  // if any of the bins are > 0, tell the user
  if (dayBins.some((a) => a > 0)) notifyUserOfRisk();

  // store the results
  SetStoreData(CROSSED_PATHS, dayBins); // TODO: Store per authority?

  // store updated cursors
  SetStoreData(AUTHORITY_SOURCE_SETTINGS, updatedAuthorities);

  // save off the current time as the last checked time
  let unixtimeUTC = dayjs().valueOf();
  SetStoreData(LAST_CHECKED, unixtimeUTC);

  return dayBins;
}

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
 * @param {*} url
 */
async function retrieveUrlAsJson(url) {
  let response = await fetch(url);
  let responseJson = await response.json();
  return responseJson;
}

/** Set the app into debug mode */
export function enableDebugMode() {
  SetStoreData(DEBUG_MODE, 'true');

  // Create faux intersection data
  let pseudoBin = [];
  for (let i = 0; i < MAX_EXPOSURE_WINDOW_DAYS; i++) {
    let intersections =
      Math.max(0, Math.floor(Math.random() * 50 - 20)) * 60 * 1000; // in millis
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
