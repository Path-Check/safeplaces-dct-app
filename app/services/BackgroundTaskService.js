import BackgroundFetch from 'react-native-background-fetch';

import { INTERSECT_INTERVAL } from '../constants/history';
import { checkIntersect } from '../helpers/Intersect';
import { HCAService } from '../services/HCAService';

export function executeTask() {
  checkIntersect();
  __DEV__ && HCAService.findNewAuthorities();
}

export default class BackgroundTaskServices {
  static start() {
    // Configure it.
    console.log('creating background task object');
    BackgroundFetch.configure(
      {
        minimumFetchInterval: INTERSECT_INTERVAL,
        // Android options
        forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
        stopOnTerminate: false,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
        requiresCharging: false, // Default
        requiresDeviceIdle: false, // Default
        requiresBatteryNotLow: false, // Default
        requiresStorageNotLow: false, // Default
      },
      async (taskId) => {
        console.log('[js] Received background-fetch event: ', taskId);
        executeTask();
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.log('[js] RNBackgroundFetch failed to start', error);
      },
    );
  }

  static stop() {
    BackgroundFetch.stop();
  }
}
