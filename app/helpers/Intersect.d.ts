import { checkIntersect as intersect } from './Intersect';
import { HealthcareAuthority } from '../store/types';
import { DayBins } from '../gps/intersect/toExposureHistory';

export const checkIntersect: (
  healthcareAuthorities: HealthcareAuthority[] | null,
  bypassTimer: boolean,
) => Promise<DayBins> = intersect;
