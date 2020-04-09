/**
 * Import a Google JSon into the Database.
 */
import { GetStoreData, SetStoreData } from '../helpers/General';

function formatLocation(placeVisit) {
  return {
    latitude: placeVisit.location.latitudeE7 * 10 ** -7,
    longitude: placeVisit.location.longitudeE7 * 10 ** -7,
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
  let storedLocations = await GetStoreData('LOCATION_DATA', false);
  storedLocations = Array.isArray(storedLocations) ? storedLocations : [];

  const newLocations = extractNewLocations(
    storedLocations,
    googleLocationHistory,
  );

  await SetStoreData('LOCATION_DATA', [...storedLocations, ...newLocations]);

  return newLocations;
}
