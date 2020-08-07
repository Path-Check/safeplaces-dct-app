import { checkIntersect as intersect } from '../helpers/Intersect';
import { HealthcareAuthority } from '../store/types';
import { emitResultDayBins } from '../gps/exposureInfo';

class IntersectService {
  isServiceRunning = false;
  private nextJob: HealthcareAuthority[] | null = null;

  checkIntersect = (
    healthcareAuthorities: HealthcareAuthority[] | null,
  ): string => {
    if (this.isServiceRunning) {
      this.nextJob = healthcareAuthorities;
      return 'skipped';
    }
    this.isServiceRunning = true;

    intersect(healthcareAuthorities)
      .then((dayBins) => {
        this.isServiceRunning = false;

        if (this.nextJob) {
          const job = this.nextJob;
          this.nextJob = null;
          this.checkIntersect(job);
        } else {
          emitResultDayBins(dayBins);
        }
      })
      .catch(() => {
        this.isServiceRunning = false;
      });

    return 'started';
  };
}

const singleton = new IntersectService();

export default singleton as IntersectService;
