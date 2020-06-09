import { combineReducers } from 'redux';

import onboardingReducer from './onboardingReducer';
import healthcareAuthoritiesReducer from './healthcareAuthoritiesReducer';

const rootReducer = combineReducers({
  onboarding: onboardingReducer,
  healthcareAuthorities: healthcareAuthoritiesReducer,
});

export default rootReducer;
