import BackgroundFetch from 'react-native-background-fetch';
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
        console.log('[js] Received background-fetch event: ', taskId);

        if (Platform.OS === 'ios') {
          NativeModules.SecureStorageManager.trimLocations();
        }

        const lastCheckedMs = Number(await GetStoreData(LAST_CHECKED));
        const intersectIntervalPassed =
          dayjs().diff(lastCheckedMs, 'hour') >= 12;

        if (intersectIntervalPassed) {
          IntersectService.checkIntersect(null);
          await SetStoreData(LAST_CHECKED, String(dayjs().valueOf()));
        }

        console.log(
          `[intersect] ${intersectIntervalPassed ? 'started' : 'skipped'}`,
        );
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
