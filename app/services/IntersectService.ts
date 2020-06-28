import { checkIntersect as intersect } from '../helpers/Intersect';
import { HealthcareAuthority } from '../store/types';
import { emitGPSExposureInfo } from '../gps/exposureInfo';
import { INTERSECT_INTERVAL } from '../constants/history';
import BackgroundFetch from 'react-native-background-fetch';

const bgTaskConfig = {
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
};

class IntersectService {
  isServiceRunning = false;
  nextJob: HealthcareAuthority[] | null = null;

  checkIntersect = (
    healthcareAuthorities: HealthcareAuthority[] | null,
    bypassTimer: boolean,
  ): string => {
    if (this.isServiceRunning) {
      this.nextJob = healthcareAuthorities;
      return 'skipped';
    }
    this.isServiceRunning = true;

    intersect(healthcareAuthorities, bypassTimer).then((result) => {
      this.isServiceRunning = false;

      if (this.nextJob) {
        const job = this.nextJob;
        this.nextJob = null;
        this.checkIntersect(job, bypassTimer);
      } else {
        emitGPSExposureInfo(result);
      }
    });

    this.startBackgroundTask();
    return 'started';
  };

  private startBackgroundTask = () => {
    BackgroundFetch.configure(
      bgTaskConfig,
      async (taskId) => {
        console.log('[js] Received background-fetch event: ', taskId);
        this.checkIntersect(null, false);
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.log('[js] RNBackgroundFetch failed to start', error);
      },
    );
  };

  // TODO: add mechanism for stopping background task
}

const singleton = new IntersectService();

export default singleton as IntersectService;
