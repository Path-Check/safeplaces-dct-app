import { createReducer } from '@reduxjs/toolkit';

import {
  getHealthcareAuthorities_failure,
  getHealthcareAuthorities_started,
  getHealthcareAuthorities_success,
} from '../actions/healthcareAuthorities/getHealthcareAuthoritiesAction';

// These will appear in redux debugger, so string names are helpful
enum ApiStatus {
  INITIAL = 'INITIAL',
  STARTED = 'STARTED',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

interface ApiRequest {
  status: ApiStatus;
  errorMessage: string | null; // This is only for redux debugging. Store as a string for the safety in the store.
}

interface HealthcareAuthority {
  name: string;
  bounds: Record<string, unknown>;
  ingest_url: string;
  publish_url: string;
}

interface State {
  availableAuthorities: HealthcareAuthority[];
  selectedAuthorities: HealthcareAuthority[];
  request: ApiRequest;
}

const initialState: State = {
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
    }),
);

export default healthcareAuthoritiesReducer;
