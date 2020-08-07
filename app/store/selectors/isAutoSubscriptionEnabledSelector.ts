import type { RootState } from '../types';
const isAutoSubscriptionEnabledSelector = (state: RootState): boolean =>
  state.healthcareAuthorities.autoSubscriptionEnabled;

export default isAutoSubscriptionEnabledSelector;
