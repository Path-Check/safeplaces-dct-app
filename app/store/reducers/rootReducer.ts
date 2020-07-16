import { combineReducers } from 'redux';

import onboardingReducer from './onboardingReducer';
import healthcareAuthoritiesReducer from './healthcareAuthoritiesReducer';
import featureFlagsReducer from './featureFlagsReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  onboarding: onboardingReducer,
  healthcareAuthorities: healthcareAuthoritiesReducer,
  featureFlags: featureFlagsReducer,
  settings: settingsReducer,
});

export default rootReducer;
