import type { RootState } from '../types';
const isOnboardingCompleteSelector = (state: RootState): boolean =>
  state.onboarding.complete;

export default isOnboardingCompleteSelector;
