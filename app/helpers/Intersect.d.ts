import {
  checkIntersect as intersect,
  transformDayBinsToExposureInfo as transform,
} from './Intersect';
import { HealthcareAuthority } from '../store/types';
import { ExposureDatum } from '../exposureHistory';

type Posix = number;

export const checkIntersect: (
  healthcareAuthorities: HealthcareAuthority[] | null,
  bypassTimer: boolean,
) => Promise<Record<Posix, ExposureDatum>> = intersect;

export const transformDayBinsToExposureInfo: (
  dayBins: number[],
) => Record<Posix, ExposureDatum> = transform;
