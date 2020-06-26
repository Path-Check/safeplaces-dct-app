import { checkIntersect } from '../helpers/Intersect';

export default class IntersectService {
  static instance = IntersectService.instance || new IntersectService();

  isServiceRunning = false;

  checkIntersect = (bypassTimer) => {
    // TODO : add job queues!!
    if (this.isServiceRunning) return 'skipped';
    this.isServiceRunning = true;

    checkIntersect(bypassTimer).then(() => {
      this.isServiceRunning = false;
    });

    return 'started';
  };
}
