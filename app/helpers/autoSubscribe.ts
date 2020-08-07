import { HealthcareAuthority } from '../store/types';
import { Coordinates } from '../common/types';

export const isLocationWithinBounds = (
  healthcareAuthority: HealthcareAuthority,
  location: Coordinates,
): boolean => {
  const {
    bounds: { ne, sw },
  } = healthcareAuthority;
  return (
    location.latitude < ne.latitude &&
    location.longitude < ne.longitude &&
    location.latitude > sw.latitude &&
    location.longitude > sw.longitude
  );
};
