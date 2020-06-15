import { RootState, HealthcareAuthority } from '../types';

const selectedHealthcareAuthoritiesSelector = (
  state: RootState,
): HealthcareAuthority[] => state.healthcareAuthorities.selectedAuthorities;

export default selectedHealthcareAuthoritiesSelector;
