import { checkIntersect as intersect } from '../helpers/Intersect';

class IntersectService {
  isServiceRunning = false;

  checkIntersect = (bypassTimer: boolean): string => {
    // TODO : add job queues!!
    if (this.isServiceRunning) return 'skipped';
    this.isServiceRunning = true;

    intersect(bypassTimer).then(() => {
      this.isServiceRunning = false;
    });

    return 'started';
  };
}

const singleton = new IntersectService();

export default singleton as IntersectService;
