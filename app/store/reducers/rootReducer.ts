import { combineReducers } from 'redux';

import onboardingReducer from './onboardingReducer';
import healthcareAuthoritiesReducer from './healthcareAuthoritiesReducer';
import featureeFlagsReducer from './featureFlagsReducer';

const rootReducer = combineReducers({
  onboarding: onboardingReducer,
  healthcareAuthorities: healthcareAuthoritiesReducer,
  featureFlags: featureeFlagsReducer,
});

export default rootReducer;
