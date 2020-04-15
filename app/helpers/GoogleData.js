import { LOCATION_DATA } from '../constants/storage';
/**
 * Import a Google JSon into the Database.
 */
import { GetStoreData, SetStoreData } from '../helpers/General';

/**
 * Rounds float number to a desired number of decimal places and returns a float
 * number. NOTE: .toFixed() returns a string, but number is required.
 * @param num - number
 * @param digits - amount of digits to round
 * @returns {number}
 */
function toFixedNumber(num, digits) {
  const pow = Math.pow(10, digits);
  return Math.round(num * pow) / pow;
}

/**
 * Formats a provided google placeVisit to a local format making sure
 * float numbers have constant number of decimal places as float numbers
 * has to be exact for later comparison.
 *
 * @param placeVisit - google place object
 * @returns {{latitude: number, time: string, longitude: number}}
 */
function formatLocation(placeVisit) {
  return {
    latitude: toFixedNumber(placeVisit.location.latitudeE7 * 10 ** -7, 7),
    longitude: toFixedNumber(placeVisit.location.longitudeE7 * 10 ** -7, 7),
    time: placeVisit.duration.startTimestampMs,
  };
}

function hasLocation(localDataJSON, loc) {
  for (const storedLoc of localDataJSON) {
    if (
      storedLoc.latitude === loc.latitude &&
      storedLoc.longitude === loc.longitude &&
      storedLoc.time === loc.time
    ) {
      return true;
    }
  }

  return false;
}

function extractNewLocations(storedLocations, googleLocationHistory) {
  return (googleLocationHistory?.timelineObjects || []).reduce(
    (newLocations, location) => {
      // Only import visited places, not paths for now
      if (location?.placeVisit) {
        const formattedLoc = formatLocation(location.placeVisit);
        if (!hasLocation(storedLocations, formattedLoc)) {
          newLocations.push(formattedLoc);
        }
      }
      return newLocations;
    },
    [],
  );
}

export async function mergeJSONWithLocalData(googleLocationHistory) {
  let storedLocations = await GetStoreData(LOCATION_DATA, false);
  storedLocations = Array.isArray(storedLocations) ? storedLocations : [];
  const newLocations = extractNewLocations(
    storedLocations,
    googleLocationHistory,
  );

  await SetStoreData(LOCATION_DATA, [...storedLocations, ...newLocations]);

  return newLocations;
}
