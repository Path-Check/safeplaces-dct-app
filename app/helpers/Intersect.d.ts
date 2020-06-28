import { checkIntersect as intersect } from './Intersect';
import { HealthcareAuthority } from '../store/types';

export const checkIntersect: (
  healthcareAuthorities: HealthcareAuthority[] | null,
  bypassTimer: boolean,
) => Promise<void> = intersect;
