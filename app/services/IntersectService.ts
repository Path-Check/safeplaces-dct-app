import { checkIntersect as intersect } from '../helpers/Intersect';
import { HealthcareAuthority } from '../store/types';

class IntersectService {
  isServiceRunning = false;
  nextJob: HealthcareAuthority[] | null = null;

  checkIntersect = (
    healthcareAuthorities: HealthcareAuthority[],
    bypassTimer: boolean,
  ): string => {
    if (this.isServiceRunning) {
      this.nextJob = healthcareAuthorities;
      return 'skipped';
    }
    this.isServiceRunning = true;

    intersect(healthcareAuthorities, bypassTimer).then(() => {
      this.isServiceRunning = false;
      if (this.nextJob) {
        const job = this.nextJob;
        this.nextJob = null;
        this.checkIntersect(job, bypassTimer);
      }
    });

    return 'started';
  };
}

const singleton = new IntersectService();

export default singleton as IntersectService;
