import { createReducer } from '@reduxjs/toolkit';

import onboardingAction from '../actions/onboardingAction';

const initialState = { complete: false };

const onboardingReducer = createReducer(initialState, {
  [onboardingAction]: state => {
    state.complete = true;
  },
});

export default onboardingReducer;
