import { createReducer } from '@reduxjs/toolkit';
import type { HealthcareAuthority, ApiRequest } from '../types';
import { ApiStatus } from '../types';

import {
  getHealthcareAuthorities_failure,
  getHealthcareAuthorities_started,
  getHealthcareAuthorities_success,
} from '../actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import toggleSelectedHealthcareAuthorityAction from '../actions/healthcareAuthorities/toggleSelectedHealthcareAuthorityAction';

type HealthCareReducerState = {
  // Because we control this list to be super small and have type safety, we use the full models
  // rather than a normalized map / id list paradigm.
  availableAuthorities: HealthcareAuthority[];
  selectedAuthorities: HealthcareAuthority[];
  request: ApiRequest;
};

const initialState: HealthCareReducerState = {
  availableAuthorities: [],
  selectedAuthorities: [],
  request: {
    status: ApiStatus.INITIAL,
    errorMessage: null,
  },
};

// The 'request' property of this reducer is helpful metadata for showing loading / error cases
// for displaying data.
const healthcareAuthoritiesReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(getHealthcareAuthorities_started, (state) => {
      state.request.status = ApiStatus.STARTED;
      state.request.errorMessage = null;
    })
    .addCase(
      getHealthcareAuthorities_success,
      (state, { payload: { healthcareAuthorities } }) => {
        state.request.status = ApiStatus.SUCCESS;
        state.request.errorMessage = null;
        state.availableAuthorities = healthcareAuthorities;
      },
    )
    .addCase(getHealthcareAuthorities_failure, (state, { meta: { error } }) => {
      state.request.status = ApiStatus.FAILURE;
      state.request.errorMessage = error.message;
    })
    .addCase(
      toggleSelectedHealthcareAuthorityAction,
      (state, { payload: { authority, overrideValue } }) => {
        // always remove
        state.selectedAuthorities = state.selectedAuthorities.filter(
          ({ internal_id }) => internal_id !== authority.internal_id,
        );
        // add if needed
        if (overrideValue) {
          state.selectedAuthorities.push(authority);
        }
      },
    ),
);

export default healthcareAuthoritiesReducer;
