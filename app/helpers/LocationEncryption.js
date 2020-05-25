/**
 * Generate a set of location hashes from a location
 */
const geohash = require('ngeohash');

const TWO_AND_HALF_MIN_MS = 2.5 * 60 * 1000;
const FIVE_MIN_MS = 5 * 60 * 1000;
const GEO_CIRCLE_RADII = [
  { latitude: 0, longitude: 0 }, // center
  { latitude: 0.0001, longitude: 0 }, // N
  { latitude: 0.00007, longitude: 0.00007 }, // NE
  { latitude: 0, longitude: 0.0001 }, // E
  { latitude: -0.00007, longitude: 0.00007 }, // SE
  { latitude: -0.0001, longitude: 0 }, // S
  { latitude: -0.00007, longitude: -0.00007 }, // SW
  { latitude: 0, longitude: -0.0001 }, // W
  { latitude: 0.00007, longitude: -0.00007 }, // NW
];

/**
 * Rounds down timestamp to the nearest 5 minute window
 *
 * @param {number} timestamp - Unix timestamps in milliseconds
 */
const roundToFiveMin = timestamp => {
  return Math.floor(timestamp / FIVE_MIN_MS) * FIVE_MIN_MS;
};

/**
 * Generates time windows for 5 minute interval before and after timestamp
 *
 * @param {number} timestamp - Unix timestamps in milliseconds
 */
const getTimeWindows = timestamp => {
  const time1 = timestamp + TWO_AND_HALF_MIN_MS;
  const time2 = timestamp - TWO_AND_HALF_MIN_MS;
  return [roundToFiveMin(time1), roundToFiveMin(time2)];
};

export const getGeohashes = location => {
  const locations = [];
  for (let i = 0; i < GEO_CIRCLE_RADII.length; i++) {
    const geoCirclePoint = GEO_CIRCLE_RADII[i];
    locations.push({
      ...location,
      latitude: location.latitude + geoCirclePoint.latitude,
      longitude: location.longitude + geoCirclePoint.longitude,
    });
  }

  const geoHashes = [];
  for (let i = 0; i < locations.length; i++) {
    const loc = locations[i];
    const locGeohash = geohash.encode(loc.latitude, loc.longitude, 8);
    // console.log(geohash.encode(loc.latitude, loc.longitude, 8));
    if (!geoHashes.includes(locGeohash)) {
      geoHashes.push(locGeohash);
    }
  }
  return geoHashes;
};

export const getLocationStrings = location => {
  const geohashes = getGeohashes(location);
  const timeWindows = getTimeWindows(location.time);
  const locationStrings = [];

  for (let i = 0; i < geohashes.length; i++) {
    locationStrings.push(geohashes[i] + timeWindows[0]);
    locationStrings.push(geohashes[i] + timeWindows[1]);
  }

  return locationStrings;
};
