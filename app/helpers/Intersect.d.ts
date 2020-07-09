import { checkIntersect as intersect } from './Intersect';
import { HealthcareAuthority } from '../store/types';
import { DayBins } from '../gps/intersect/exposureHistory';

export const checkIntersect: (
  healthcareAuthorities: HealthcareAuthority[] | null,
) => Promise<DayBins> = intersect;
