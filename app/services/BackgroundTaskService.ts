import BackgroundFetch from 'react-native-background-fetch';

import { INTERSECT_INTERVAL } from '../constants/history';
import IntersectService from './IntersectService';

class BackgroundTaskService {
  start() {
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
        IntersectService.checkIntersect(null, false);
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.log('[js] RNBackgroundFetch failed to start', error);
      },
    );
  }

  stop() {
    BackgroundFetch.stop();
  }
}

const singleton = new BackgroundTaskService();

export default singleton as BackgroundTaskService;
