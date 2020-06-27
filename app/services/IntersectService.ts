import { checkIntersect as intersect } from '../helpers/Intersect';
import { HealthcareAuthority } from '../store/types';

class IntersectService {
  isServiceRunning = false;

  checkIntersect = (
    healthcareAuthorities: HealthcareAuthority[],
    bypassTimer: boolean,
  ): string => {
    // TODO : add job queues!!
    if (this.isServiceRunning) return 'skipped';
    this.isServiceRunning = true;

    intersect(healthcareAuthorities, bypassTimer).then(() => {
      this.isServiceRunning = false;
    });

    return 'started';
  };
}

const singleton = new IntersectService();

export default singleton as IntersectService;
