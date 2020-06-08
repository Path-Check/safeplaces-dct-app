import { createReducer } from '@reduxjs/toolkit';

import onboardingCompleteAction from '../actions/onboardingCompleteAction';

const initialState = { complete: false };

const onboardingReducer = createReducer(initialState, {
  [onboardingCompleteAction]: (state) => {
    state.complete = true;
  },
});

export default onboardingReducer;
