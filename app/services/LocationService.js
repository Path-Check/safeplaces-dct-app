import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { NativeModules, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

import { CROSSED_PATHS } from '../constants/storage';
import { GetStoreData } from '../helpers/General';
import languages from '../locales/languages';

let isBackgroundGeolocationConfigured = false;
const LOCATION_DISABLED_NOTIFICATION_ID = '55';

// Time (in milliseconds) between location information polls
// 5 minutes
export const MIN_LOCATION_UPDATE_MS = 300000;

export const Reason = {
  /**
   * Location services are disabled for the device
   */
  DEVICE_LOCATION_OFF: 'DEVICE_LOCATION_OFF',

  /**
   * Location services are disabled for this app
   */
  APP_NOT_AUTHORIZED: 'APP_NOT_AUTHORIZED',

  /**
   * User has granted location tracking permissions
   * to the app, and device location services are running
   */
  ALL_CONDITIONS_MET: 'ALL_CONDITIONS_MET',
};

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

    BackgroundGeolocation.configure({
      maxLocations: 0,
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 5,
      distanceFilter: 5,
      notificationTitle: languages.t('label.location_enabled_title'),
      notificationText: languages.t('label.location_enabled_message'),
      debug: false,
      startOnBoot: true,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
      interval: MIN_LOCATION_UPDATE_MS,
      fastestInterval: MIN_LOCATION_UPDATE_MS,
      activitiesInterval: MIN_LOCATION_UPDATE_MS,
      activityType: 'AutomotiveNavigation',
      pauseLocationUpdates: false,
      saveBatteryOnBackground: true,
      stopOnStillActivity: false,
    });

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log(
        '[INFO] BackgroundGeolocation authorization status: ' + status,
      );

      if (status === BackgroundGeolocation.AUTHORIZED) {
        // TODO: this should not restart if user opted out
        BackgroundGeolocation.start(); // force running, if not already running
        BackgroundGeolocation.checkStatus(({ locationServicesEnabled }) => {
          if (!locationServicesEnabled) {
            PushNotification.localNotification({
              id: LOCATION_DISABLED_NOTIFICATION_ID,
              title: languages.t('label.location_disabled_title'),
              message: languages.t('label.location_disabled_message'),
            });
          } else {
            PushNotification.cancelLocalNotifications({
              id: LOCATION_DISABLED_NOTIFICATION_ID,
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
    PushNotification.localNotification({
      title: languages.t('label.location_disabled_title'),
      message: languages.t('label.location_disabled_message'),
    });

    BackgroundGeolocation.removeAllListeners();
    BackgroundGeolocation.stop();

    isBackgroundGeolocationConfigured = false;
  }

  static async getHasPotentialExposure() {
    const dayBin = await GetStoreData(CROSSED_PATHS, false);
    return !!dayBin && dayBin.some((exposure) => exposure > 0);
  }

  static async getBackgroundGeoStatus() {
    return new Promise((resolve, reject) => {
      BackgroundGeolocation.checkStatus(
        (status) => resolve(status),
        (e) => reject(e),
      );
    });
  }

  static async checkStatus() {
    const hasPotentialExposure = await this.getHasPotentialExposure();

    const {
      authorization: isAppGpsEnabled,
      isRunning,
      locationServicesEnabled: isDeviceGpsEnabled,
    } = await this.getBackgroundGeoStatus();

    if (!isDeviceGpsEnabled) {
      return {
        canTrack: false,
        reason: Reason.DEVICE_LOCATION_OFF,
        hasPotentialExposure,
        isRunning,
      };
    }

    if (!isAppGpsEnabled) {
      return {
        canTrack: false,
        reason: Reason.APP_NOT_AUTHORIZED,
        hasPotentialExposure,
        isRunning,
      };
    }

    return {
      canTrack: true,
      reason: Reason.ALL_CONDITIONS_MET,
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

  static async getLocationData() {
    return NativeModules.SecureStorageManager.getLocations();
  }

  /**
   * Returns the most recent point of location data for a user.
   * This is the last item in the location data array.
   */
  static async getMostRecentUserGps() {
    const locData = await LocationServices.getLocationData();
    return locData[locData.length - 1];
  }
}
