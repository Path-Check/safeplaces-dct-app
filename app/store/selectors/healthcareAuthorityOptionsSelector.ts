import { RootState, HealthcareAuthority } from '../types';

const healthcareAuthorityOptionsSelector = (
  state: RootState,
): HealthcareAuthority[] => state.healthcareAuthorities.availableAuthorities;

export default healthcareAuthorityOptionsSelector;
