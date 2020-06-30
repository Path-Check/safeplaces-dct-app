import { checkIntersect as intersect } from '../helpers/Intersect';
import { HealthcareAuthority } from '../store/types';
import { emitGPSExposureInfo } from '../gps/exposureInfo';
import BackgroundTaskService from './BackgroundTaskService';

class IntersectService {
  isServiceRunning = false;
  private nextJob: HealthcareAuthority[] | null = null;

  constructor() {
    BackgroundTaskService.start();
  }

  checkIntersect = (
    healthcareAuthorities: HealthcareAuthority[] | null,
    bypassTimer: boolean,
  ): string => {
    if (this.isServiceRunning) {
      this.nextJob = healthcareAuthorities;
      return 'skipped';
    }
    this.isServiceRunning = true;

    intersect(healthcareAuthorities, bypassTimer).then((exposureInfo) => {
      this.isServiceRunning = false;

      if (this.nextJob) {
        const job = this.nextJob;
        this.nextJob = null;
        this.checkIntersect(job, bypassTimer);
      } else {
        emitGPSExposureInfo(exposureInfo);
      }
    });

    return 'started';
  };
}

const singleton = new IntersectService();

export default singleton as IntersectService;
