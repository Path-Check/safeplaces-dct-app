import { checkIntersect as intersect } from './Intersect';

export const checkIntersect: (
  bypassTimer: boolean,
) => Promise<void> = intersect;
