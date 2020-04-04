/**
 * Intersect a set of points against the user's locally stored points.
 *
 * v1 - Unencrypted, simpleminded (minimal optimization).
 */

import { GetStoreData, SetStoreData } from '../helpers/General';

export async function IntersectSet(concernLocationArray) {
  GetStoreData('LOCATION_DATA').then(locationArrayString => {
    var locationArray;
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
    let concernDistWindow = 60; // distance of concern, in feet

    // At 38 degrees North latitude:
    let ftPerLat = 364000; // 1 deg lat equals 364,000 ft
    let ftPerLon = 288200; // 1 deg of longitude equals 288,200 ft

    var nowUTC = new Date().toISOString();
    var timeNow = Date.parse(nowUTC);

    // Save a little CPU, no need to do sqrt()
    let concernDistWindowSq = concernDistWindow * concernDistWindow;

    // Both locationArray and concernLocationArray should be in the
    // format [ { "time": 123, "latitude": 12.34, "longitude": 34.56 }]

    for (let loc of localArray) {
      let timeMin = loc.time - concernTimeWindow;
      let timeMax = loc.time + concernTimeWindow;

      let i = binarySearchForTime(concernArray, timeMin);
      if (i < 0) i = -(i + 1);

      while (i < concernArray.length && concernArray[i].time <= timeMax) {
        // Perform a simple Euclidian distance test
        let deltaLat = (concernArray[i].latitude - loc.latitude) * ftPerLat;
        let deltaLon = (concernArray[i].longitude - loc.longitude) * ftPerLon;
        // TODO: Scale ftPer factors based on lat to reduce projection error

        let distSq = deltaLat * deltaLat + deltaLon * deltaLon;
        if (distSq < concernDistWindowSq) {
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
    SetStoreData('CROSSED_PATHS', dayBin); // TODO: Store per authority?
  });
}

function normalizeData(arr) {
  // This fixes several issues that I found in different input data:
  //   * Values stored as strings instead of numbers
  //   * Extra info in the input
  //   * Improperly sorted data (can happen after an Import)
  var result = [];

  for (var i = 0; i < arr.length; i++) {
    elem = arr[i];
    if ('time' in elem && 'latitude' in elem && 'longitude' in elem) {
      result.push({
        time: Number(elem.time),
        latitude: Number(elem.latitude),
        longitude: Number(elem.longitude),
      });
    }
  }

  result.sort();
  return result;
}

function binarySearchForTime(array, targetTime) {
  // Binary search:
  //   array = sorted array
  //   target = search target
  // Returns:
  //   value >= 0,   index of found item
  //   value < 0,    i where -(i+1) is the insertion point
  var i = 0;
  var n = array.length - 1;

  while (i <= n) {
    var k = (n + i) >> 1;
    var cmp = targetTime - array[k].time;

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
