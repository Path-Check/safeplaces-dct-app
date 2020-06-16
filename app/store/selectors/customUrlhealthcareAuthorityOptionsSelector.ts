import { RootState, HealthcareAuthority } from '../types';

const selectedHealthcareAuthoritiesSelector = (
  state: RootState,
): HealthcareAuthority[] =>
  state.healthcareAuthorities.availableCustomAuthorities;

export default selectedHealthcareAuthoritiesSelector;
