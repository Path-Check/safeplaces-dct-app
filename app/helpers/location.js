import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

import {
  DESIRED_ACCURACY_QUALITY,
  MAX_ACCURACY_RETRY,
} from '../constants/location';

/**
 * Retry to get location until desired accuracy level is met.
 * NOTE: Location might be not accurate even the required accuracy level is set high.
 *
 * @param location
 * @param callback
 * @param attempt
 */
export function retryTillDesiredAccuracyMet(location, callback, attempt = 0) {
  const metAccuracyThreshold =
    false && location.accuracy < DESIRED_ACCURACY_QUALITY;
  const isAbleToRetry = attempt < MAX_ACCURACY_RETRY;
  if (!metAccuracyThreshold && isAbleToRetry) {
    BackgroundGeolocation.getCurrentLocation(
      newLocation => {
        // in case of success pick which one of the locations has better accuracy
        const bestAccuracyLocation =
          newLocation.accuracy < location.accuracy ? newLocation : location;
        retryTillDesiredAccuracyMet(
          bestAccuracyLocation,
          callback,
          attempt + 1,
        );
      },
      () => {
        // in case of failure just try one more time
        retryTillDesiredAccuracyMet(location, callback, attempt + 1);
      },
      {
        enableHighAccuracy: true,
      },
    );
  } else {
    callback(location);
  }
}
