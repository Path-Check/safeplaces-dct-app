import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';

import { BACKGROUND_TASK_INTERVAL } from '../constants/history';
import IntersectService from './IntersectService';
import { Platform, NativeModules } from 'react-native';
import { GetStoreData, SetStoreData } from '../helpers/General';
import { LAST_CHECKED } from '../constants/storage';
import dayjs from 'dayjs';

class BackgroundTaskService {
  start() {
    // Configure it.
    console.log('creating background task object');
    BackgroundFetch.configure(
      {
        minimumFetchInterval: BACKGROUND_TASK_INTERVAL,
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
        PushNotification.localNotification({
          title: 'Running background task',
          message: new Date().toLocaleString(),
        });
        console.log('[js] Received background-fetch event: ', taskId);

        if (Platform.OS === 'ios') {
          NativeModules.SecureStorageManager.trimLocations();
        }

        const lastCheckedMs = Number(await GetStoreData(LAST_CHECKED));
        if (dayjs().diff(lastCheckedMs, 'hour') >= 12) {
          IntersectService.checkIntersect(null);
          await SetStoreData(LAST_CHECKED, String(dayjs().valueOf()));
        }

        BackgroundFetch.finish(taskId);
      },
      (error) => {
        PushNotification.localNotification({
          title: 'Failed to run background task',
          message: error.toString(),
        });
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
