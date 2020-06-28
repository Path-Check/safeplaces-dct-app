import { checkIntersect as intersect } from './Intersect';
import { HealthcareAuthority } from '../store/types';
import { ExposureDatum } from '../exposureHistory';

export const checkIntersect: (
  healthcareAuthorities: HealthcareAuthority[] | null,
  bypassTimer: boolean,
) => Promise<Record<number, ExposureDatum>> = intersect;
