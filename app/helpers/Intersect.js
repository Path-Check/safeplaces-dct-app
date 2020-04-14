/**
 * Intersect a set of points against the user's locally stored points.
 *
 * v1 - Unencrypted, simpleminded (minimal optimization).
 */

import PushNotification from 'react-native-push-notification';

import { isPlatformiOS } from './../Util';
import {
  LOCATION_DATA,
  CROSSED_PATHS,
  AUTHORITY_SOURCE_SETTINGS,
  AUTHORITY_NEWS,
  LAST_CHECKED,
} from '../constants/storage';
import { GetStoreData, SetStoreData } from '../helpers/General';
import languages from '../locales/languages';

export async function IntersectSet(concernLocationArray, completion) {
  GetStoreData(LOCATION_DATA).then(locationArrayString => {
    let locationArray;
    if (locationArrayString !== null) {
      locationArray = JSON.parse(locationArrayString);
    } else {
      locationArray = [];
    }

    let dayBin = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]; // Bins for 28 days

    // Sort the concernLocationArray
    let localArray = normalizeData(locationArray);
    let concernArray = normalizeData(concernLocationArray);

    let concernTimeWindow = 1000 * 60 * 60 * 2; // +/- 2 hours window

    let nowUTC = new Date().toISOString();
    let timeNow = Date.parse(nowUTC);

    // Both locationArray and concernLocationArray should be in the
    // format [ { "time": 123, "latitude": 12.34, "longitude": 34.56 }]

    for (let loc of localArray) {
      let timeMin = loc.time - concernTimeWindow;
      let timeMax = loc.time + concernTimeWindow;

      let i = binarySearchForTime(concernArray, timeMin);
      if (i < 0) i = -(i + 1);

      while (i < concernArray.length && concernArray[i].time <= timeMax) {
        if (
          isLocationsNearby(
            concernArray[i].latitude,
            concernArray[i].longitude,
            loc.latitude,
            loc.longitude,
          )
        ) {
          // Crossed path.  Bin the count of encounters by days from today.
          let longAgo = timeNow - loc.time;
          let daysAgo = Math.round(longAgo / (1000 * 60 * 60 * 24));

          dayBin[daysAgo] += 1;
        }

        i++;
      }
    }

    // TODO: Show in the UI!
    console.log('Crossing results: ', dayBin);
    SetStoreData(CROSSED_PATHS, dayBin); // TODO: Store per authority?
    completion(dayBin);
  });
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
export function isLocationsNearby(lat1, lon1, lat2, lon2) {
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

function normalizeData(arr) {
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

export function checkIntersect() {
  // This function is called once every 12 hours.  It should do several things:

  console.log(
    'Intersect tick entering on',
    isPlatformiOS() ? 'iOS' : 'Android',
  );
  // this.findNewAuthorities(); NOT IMPLEMENTED YET

  // Get the user's health authorities
  GetStoreData(AUTHORITY_SOURCE_SETTINGS)
    .then(authority_list => {
      if (!authority_list) {
        console.log('No authorities', authority_list);
        return;
      }

      let name_news = [];
      SetStoreData(AUTHORITY_NEWS, name_news);

      if (authority_list) {
        // Pull down data from all the registered health authorities
        authority_list = JSON.parse(authority_list);
        for (const authority of authority_list) {
          console.log('[auth]', authority);
          fetch(authority.url)
            .then(response => response.json())
            .then(responseJson => {
              // Example response =
              // { "authority_name":  "Steve's Fake Testing Organization",
              //   "publish_date_utc": "1584924583",
              //   "info_website": "https://www.who.int/emergencies/diseases/novel-coronavirus-2019",
              //   "concern_points":
              //    [
              //      { "time": 123, "latitude": 12.34, "longitude": 12.34},
              //      { "time": 456, "latitude": 12.34, "longitude": 12.34}
              //    ]
              // }
              // TODO: Add an "info_exposure_url" to allow recommendations for
              //       the health authority driectly on the Exposure History
              //       page (e.g. the "What Do I Do Now?" button)
              // TODO: Add an "info_newsflash" UTC timestamp and popup a
              //       notification if that changes, i.e. if there is a newsflash?

              // Update cache of info about the authority
              GetStoreData(AUTHORITY_NEWS).then(nameNewsString => {
                let name_news = [];
                if (nameNewsString !== null) {
                  name_news = JSON.parse(nameNewsString);
                }

                name_news.push({
                  name: responseJson.authority_name,
                  news_url: responseJson.info_website,
                });
                SetStoreData(AUTHORITY_NEWS, name_news);
              });

              // TODO: Look at "publish_date_utc".  We should notify users if
              //       their authority is no longer functioning.)

              IntersectSet(responseJson.concern_points, dayBin => {
                if (dayBin !== null && dayBin.reduce((a, b) => a + b, 0) > 0) {
                  PushNotification.localNotification({
                    title: languages.t('label.push_at_risk_title'),
                    message: languages.t('label.push_at_risk_message'),
                  });
                }
              });
            });

          let nowUTC = new Date().toISOString();
          let unixtimeUTC = Date.parse(nowUTC);
          // Last checked key is not being used atm. TODO check this to update periodically instead of every foreground activity
          SetStoreData(LAST_CHECKED, unixtimeUTC);
        }
      } else {
        console.log('No authority list');
        return;
      }
    })
    .catch(error => console.log('Failed to load authority list', error));
}
