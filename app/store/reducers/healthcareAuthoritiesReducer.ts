import { createReducer } from '@reduxjs/toolkit';
import type { HealthcareAuthority, ApiRequest } from '../types';
import { ApiStatus } from '../types';

import {
  getHealthcareAuthorities_failure,
  getHealthcareAuthorities_started,
  getHealthcareAuthorities_success,
} from '../actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import toggleSelectedHealthcareAuthorityAction from '../actions/healthcareAuthorities/toggleSelectedHealthcareAuthorityAction';
import getCurrentlySelectedAuthority from '../actions/healthcareAuthorities/getCurrentlySelectedAuthority';

type HealthCareReducerState = {
  // Because we control this list to be super small and have type safety, we use the full models
  // rather than a normalized map / id list paradigm.
  availableAuthorities: HealthcareAuthority[];
  availableCustomAuthorities: HealthcareAuthority[];
  selectedAuthorities: HealthcareAuthority[];
  currentlySelectedAuthority: HealthcareAuthority; // TODO: change this
  request: ApiRequest;
};

const initialState: HealthCareReducerState = {
  availableAuthorities: [],
  availableCustomAuthorities: [], // For testing, from a custom uploaded YAML
  selectedAuthorities: [],
  currentlySelectedAuthority: {},
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
      (state, { payload: { healthcareAuthorities, usesCustomUrl } }) => {
        state.request.status = ApiStatus.SUCCESS;
        state.request.errorMessage = null;
        // This is a hack we use to hijack this reducer + action for
        // using a testing url for the yaml instead of the environment one
        if (usesCustomUrl) {
          state.availableCustomAuthorities = healthcareAuthorities;
        } else {
          state.availableAuthorities = healthcareAuthorities;
        }

        // Ensure that we don't subscribe to non-existent HAs, if the yaml updates
        const validIds = new Set();
        state.availableAuthorities.forEach(({ internal_id }) => {
          validIds.add(internal_id);
        });
        state.availableCustomAuthorities.forEach(({ internal_id }) => {
          validIds.add(internal_id);
        });
        state.selectedAuthorities = state.selectedAuthorities.filter(
          ({ internal_id }) => validIds.has(internal_id),
        );
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
    )
    .addCase(
      getCurrentlySelectedAuthority,
      (state, { payload: { authority, selectedValue } }) => {
        if (selectedValue) state.currentlySelectedAuthority = authority;
      },
    ),
);

export default healthcareAuthoritiesReducer;
