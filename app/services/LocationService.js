import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { NativeModules, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

import {
  GOV_DO_TOKEN,
  MEPYD_C5I_API_URL,
  MEPYD_C5I_SERVICE,
} from '../constants/DR/baseUrls';
import { CROSSED_PATHS, PARTICIPATE } from '../constants/storage';
import { GetStoreData, SetStoreData } from '../helpers/General';
import languages from '../locales/languages';

let isBackgroundGeolocationConfigured = false;
const LOCATION_DISABLED_NOTIFICATION = '55';
const COVID_BASE_ID = '5590D7B3781E7592F6638F0D0D778282';

export const Reason = {
  LOCATION_OFF: 'LOCATION_OFF',
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  USER_OFF: 'USER_OFF',
};

export class LocationData {
  constructor() {
    // The desired location interval, and the minimum acceptable interval
    this.locationInterval = 60000 * 5; // Time (in milliseconds) between location information polls.  E.g. 60000*5 = 5 minutes

    // minLocationSaveInterval should be shorter than the locationInterval (to avoid strange skips)
    this.minLocationSaveInterval = Math.floor(this.locationInterval * 0.8); // Minimum time between location information saves.  60000*4 = 4 minutes

    // Maximum time that we will backfill for missing data
    this.maxBackfillTime = 60000 * 60 * 24; // Time (in milliseconds).  60000 * 60 * 8 = 24 hours
  }

  async getLocationData() {
    return NativeModules.SecureStorageManager.getLocations();
  }

  /**
   * Validates that `point` has both a latitude and longitude field
   * @param {*} point - Object to validate
   */
  isValidPoint(point) {
    if (point && !point.latitude && !point.latitude === 0) {
      console.error('`point` param must have a latitude field');
      return false;
    }

    if (point && !point.longitude && !point.longitude === 0) {
      console.error('`point` param must have a longitude field');
      return false;
    }

    return true;
  }

  /**
   * Validates that an object is a valid geographic bounding box.
   * A valid box has a `ne` and `sw` field that each contain a valid GPS point
   * @param {*} region - Object to validate
   */
  isValidBoundingBox(region) {
    if (!region.ne || !this.isValidPoint(region.ne)) {
      console.error(`invalid 'ne' field for bounding box: ${region.ne}`);
      return false;
    }

    if (!region.sw || !this.isValidPoint(region.sw)) {
      console.error(`invalid 'ne' field for bounding box: ${region.sw}`);
      return false;
    }

    return true;
  }

  /**
   * Returns the most recent point of location data for a user.
   * This is the last item in the location data array.
   */
  async getMostRecentUserLoc() {
    const locData = await this.getLocationData();
    return locData[locData.length - 1];
  }

  /**
   * Given a GPS coordinate, check if it is within the bounding
   * box of a region.
   * @param {*} point - Object with a `latitude` and `longitude` field
   * @param {*} region - Object with a `ne` and `sw` field that each contain a GPS point
   */
  isPointInBoundingBox(point, region) {
    if (
      (point && !this.isValidPoint(point)) ||
      !this.isValidBoundingBox(region)
    ) {
      return false;
    } else {
      const { latitude: pointLat, longitude: pointLon } = point;
      const { latitude: neLat, longitude: neLon } = region.ne;
      const { latitude: swLat, longitude: swLon } = region.sw;

      const [latMax, latMin] = neLat > swLat ? [neLat, swLat] : [swLat, neLat];
      const [lonMax, lonMin] = neLon > swLon ? [neLon, swLon] : [swLon, neLon];

      return (
        pointLat < latMax &&
        pointLat > latMin &&
        pointLon < lonMax &&
        pointLon > lonMin
      );
    }
  }
}

export default class LocationServices {
  static async start() {
    // handles edge cases around Android where start might get called again even though
    // the service is already created.  Make sure the listeners are still bound and exit
    if (isBackgroundGeolocationConfigured) {
      BackgroundGeolocation.start();
      return;
    }

    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification(notification) {
        console.log('NOTIFICATION:', notification);
        // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // Setting the permissions to true causes a crash on Android, because that configuration requires Firebase
      // https://github.com/zo0r/react-native-push-notification#usage
      requestPermissions: Platform.OS === 'ios',
    });

    const locationData = new LocationData();

    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 5,
      distanceFilter: 5,
      notificationTitle: languages.t('label.location_enabled_title'),
      notificationText: languages.t('label.location_enabled_message'),
      debug: false,
      startOnBoot: true,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
      interval: locationData.locationInterval,
      fastestInterval: locationData.locationInterval,
      activitiesInterval: locationData.locationInterval,
      activityType: 'AutomotiveNavigation',
      pauseLocationUpdates: false,
      saveBatteryOnBackground: true,
      stopOnStillActivity: false,
    });

    BackgroundGeolocation.on('error', error => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('authorization', status => {
      console.log(
        '[INFO] BackgroundGeolocation authorization status: ' + status,
      );

      if (status === BackgroundGeolocation.AUTHORIZED) {
        // TODO: this should not restart if user opted out
        BackgroundGeolocation.start(); // force running, if not already running
        BackgroundGeolocation.checkStatus(({ locationServicesEnabled }) => {
          if (!locationServicesEnabled) {
            PushNotification.localNotification({
              id: LOCATION_DISABLED_NOTIFICATION,
              title: languages.t('label.location_disabled_title'),
              message: languages.t('label.location_disabled_message'),
            });
          } else {
            PushNotification.cancelLocalNotifications({
              id: LOCATION_DISABLED_NOTIFICATION,
            });
          }
        });
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.on('location', async location => {
      GetStoreData('shareLocation', true).then(isPositive => {
        if (isPositive) {
          const body = JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude,
            time: location.time,
            covidId: COVID_BASE_ID,
          });
          fetch(`${MEPYD_C5I_SERVICE}/${MEPYD_C5I_API_URL}/UserTrace`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              gov_do_token: GOV_DO_TOKEN,
            },
            body,
          })
            .then(function(response) {
              return response.json();
            })
            .then(data => {
              return data;
            })
            .catch(error => {
              console.error('[ERROR] ' + error);
            });
        }
      });
    });

    BackgroundGeolocation.on('abort_requested', () => {
      console.log('[INFO] Server responded with 285 Updates Not Required');
      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    });

    BackgroundGeolocation.on('http_authorization', () => {
      console.log('[INFO] App needs to authorize the http requests');
    });

    BackgroundGeolocation.on('stop', () => {
      PushNotification.localNotification({
        title: languages.t('label.location_disabled_title'),
        message: languages.t('label.location_disabled_message'),
      });
      console.log('[INFO] stop');
    });
    BackgroundGeolocation.on('stationary', () => {
      console.log('[INFO] stationary');
    });

    const {
      authorization,
      isRunning,
      locationServicesEnabled,
    } = await this.getBackgroundGeoStatus();

    console.log('[INFO] BackgroundGeolocation service is running', isRunning);
    console.log(
      '[INFO] BackgroundGeolocation services enabled',
      locationServicesEnabled,
    );
    console.log('[INFO] BackgroundGeolocation auth status: ' + authorization);

    BackgroundGeolocation.start(); //triggers start on start event
    isBackgroundGeolocationConfigured = true;
  }

  static async stop() {
    // unregister all event listeners
    PushNotification.localNotification({
      title: languages.t('label.location_disabled_title'),
      message: languages.t('label.location_disabled_message'),
    });
    BackgroundGeolocation.removeAllListeners();
    BackgroundGeolocation.stop();
    isBackgroundGeolocationConfigured = false;
    await SetStoreData(PARTICIPATE, 'false');
  }

  static async getHasPotentialExposure() {
    const dayBin = await GetStoreData(CROSSED_PATHS, false);
    return !!dayBin && dayBin.some(exposure => exposure > 0);
  }

  static async getParticpating() {
    return await GetStoreData(PARTICIPATE, false);
  }

  static async getBackgroundGeoStatus() {
    return new Promise((resolve, reject) => {
      BackgroundGeolocation.checkStatus(
        status => resolve(status),
        e => reject(e),
      );
    });
  }

  static async checkStatus() {
    const hasPotentialExposure = await this.getHasPotentialExposure();

    const {
      authorization,
      isRunning,
      locationServicesEnabled,
    } = await this.getBackgroundGeoStatus();

    const particpating = await this.getParticpating();
    if (!particpating) {
      return {
        canTrack: false,
        reason: Reason.USER_OFF,
        hasPotentialExposure,
        isRunning,
      };
    }

    if (!locationServicesEnabled) {
      return {
        canTrack: false,
        reason: Reason.LOCATION_OFF,
        hasPotentialExposure,
        isRunning,
      };
    }

    if (authorization != BackgroundGeolocation.AUTHORIZED) {
      return {
        canTrack: false,
        reason: Reason.NOT_AUTHORIZED,
        hasPotentialExposure,
        isRunning,
      };
    }

    return {
      canTrack: true,
      reason: '',
      hasPotentialExposure,
      isRunning,
    };
  }

  /**
   * Like checkStatus, but it also tries to start/stop the service as
   * appropriate.
   *
   * - If the user has opted out or permissions are not available, stop.
   * - If the user has opted in and perissions are available, start.
   */
  static async checkStatusAndStartOrStop() {
    const status = await this.checkStatus();

    const { canTrack, isRunning } = status;

    if (canTrack && !isRunning) {
      this.start();
    }

    if (!canTrack && isRunning) {
      this.stop();
    }
    return status;
  }
}
