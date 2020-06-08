import { combineReducers } from 'redux';

import onboardingReducer from './onboardingReducer';

const rootReducer = combineReducers({
  onboarding: onboardingReducer,
});

export default rootReducer;
