/**
 * Intersect a set of points against the user's locally stored points.
 *
 * v1 - Unencrypted, simpleminded (minimal optimization).
 */

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import PushNotification from 'react-native-push-notification';

import { isPlatformiOS } from './../Util';
import {
  CONCERN_TIME_WINDOW_MINUTES,
  DEFAULT_EXPOSURE_PERIOD_MINUTES,
  MAX_EXPOSURE_WINDOW_DAYS,
} from '../constants/history';
import {
  AUTHORITY_NEWS,
  AUTHORITY_SOURCE_SETTINGS,
  CROSSED_PATHS,
  LAST_CHECKED,
  LOCATION_DATA,
} from '../constants/storage';
import { DEBUG_MODE } from '../constants/storage';
import { GetStoreData, SetStoreData } from '../helpers/General';
import languages from '../locales/languages';

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
  concernTimeWindowMS = 1000 * 60 * CONCERN_TIME_WINDOW_MINUTES,
  defaultExposurePeriodMS = DEFAULT_EXPOSURE_PERIOD_MINUTES * 60 * 1000,
) {
  // useful for time calcs
  dayjs.extend(duration);

  // generate an array with the asked for number of day bins
  const dayBins = getEmptyLocationBins(numDayBins);

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
      if ('time' in elem && 'latitude' in elem && 'longitude' in elem) {
        result.push({
          time: Number(elem.time),
          latitude: Number(elem.latitude),
          longitude: Number(elem.longitude),
        });
      }
    }

    result.sort((a, b) => a.time - b.time);
  }
  return result;
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
 * Kicks off the intersection process.  Immediately returns after starting the
 * background intersection.  Typically would be run about every 12 hours, but
 * but might get run more frequently, e.g. when the user changes authority settings
 *
 * TODO: This call kicks off the intersection, as well as getting basic info
 *        from the authority (e.g. the news url) since we get that in the same call.
 *        Ideally those should probably be broken up better, but for now leaving it alone.
 */
export function checkIntersect() {
  console.log(
    'Intersect tick entering on',
    isPlatformiOS() ? 'iOS' : 'Android',
  );

  asyncCheckIntersect().then(result => {
    console.log('[intersect] completed: ', result);
  });
}

/**
 * Async run of the intersection.  Also saves off the news sources that the authories specified,
 *    since that comes from the authorities in the same download.
 *
 * Returns the array of day bins (mostly for debugging purposes)
 */
async function asyncCheckIntersect() {
  // Set up the empty set of dayBins for intersections, and the array for the news urls
  let dayBins = getEmptyLocationBins();
  let name_news = [];

  // get the saved set of locations for the user, normalize and sort
  let locationArray = normalizeAndSortLocations(await getSavedLocationArray());

  // get the health authorities
  let authority_list = await GetStoreData(AUTHORITY_SOURCE_SETTINGS);

  if (authority_list) {
    // Parse the registered health authorities
    authority_list = JSON.parse(authority_list);

    for (const authority of authority_list) {
      try {
        let responseJson = await retrieveUrlAsJson(authority.url);

        // Update the news array with the info from the authority
        name_news.push({
          name: responseJson.authority_name,
          news_url: responseJson.info_website,
        });

        // intersect the users location with the locations from the authority
        let tempDayBin = intersectSetIntoBins(
          locationArray,
          normalizeAndSortLocations(responseJson.concern_points),
        );

        // Update each day's bin with the result from the intersection.  To keep the
        //  difference between no data (==-1) and exposure data (>=0), there
        //  are a total of 3 cases to consider.
        dayBins = dayBins.map((currentValue, i) => {
          if (currentValue < 0) return tempDayBin[i];
          if (tempDayBin[i] < 0) return currentValue;
          return currentValue + tempDayBin[i];
        });
      } catch (error) {
        // TODO: We silently fail.  Could be a JSON parsing issue, could be a network issue, etc.
        //       Should do better than this.
        console.log('[authority] fetch/parse error :', error);
      }
    }
  }

  // Store the news arary for the authorities found.
  SetStoreData(AUTHORITY_NEWS, name_news);

  // if any of the bins are > 0, tell the user
  if (dayBins.some(a => a > 0)) notifyUserOfRisk();

  // store the results
  SetStoreData(CROSSED_PATHS, dayBins); // TODO: Store per authority?

  // save off the current time as the last checked time
  let unixtimeUTC = dayjs().valueOf();
  SetStoreData(LAST_CHECKED, unixtimeUTC);

  return dayBins;
}

export function getEmptyLocationBins(
  exposureWindowDays = MAX_EXPOSURE_WINDOW_DAYS,
) {
  return new Array(exposureWindowDays).fill(-1);
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

/**
 * Gets the currently saved locations as a location array
 */
async function getSavedLocationArray() {
  let locationArrayString = await GetStoreData(LOCATION_DATA);
  if (locationArrayString !== null) {
    return JSON.parse(locationArrayString);
  }
  return [];
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
