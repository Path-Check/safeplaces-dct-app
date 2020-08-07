import { createReducer } from '@reduxjs/toolkit';
import type { HealthcareAuthority, ApiRequest } from '../types';
import { ApiStatus } from '../types';

import {
  getHealthcareAuthorities_failure,
  getHealthcareAuthorities_started,
  getHealthcareAuthorities_success,
} from '../actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import toggleSelectedHealthcareAuthorityAction from '../actions/healthcareAuthorities/toggleSelectedHealthcareAuthorityAction';
import toggleAutoSubscriptionBannerAction from '../actions/healthcareAuthorities/toggleAutoSubscriptionBannerAction';

type HealthCareReducerState = {
  // Because we control this list to be super small and have type safety, we use the full models
  // rather than a normalized map / id list paradigm.
  availableAuthorities: HealthcareAuthority[];
  availableCustomAuthorities: HealthcareAuthority[];
  selectedAuthorities: HealthcareAuthority[];
  request: ApiRequest;
  autoSubscription: {
    active: boolean; // controls firing. We set to false after any toggle so that auto-subscribe happens max of once, and before manual.
    bannerDismissed: boolean; // independently show banner until dismissed
    selectedAuthority: HealthcareAuthority | null;
  };
};

const initialState: HealthCareReducerState = {
  availableAuthorities: [],
  availableCustomAuthorities: [], // For testing, from a custom uploaded YAML
  selectedAuthorities: [],
  request: {
    status: ApiStatus.INITIAL,
    errorMessage: null,
  },
  autoSubscription: {
    active: true,
    bannerDismissed: false,
    selectedAuthority: null,
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
      (
        state,
        { payload: { authority, overrideValue }, meta: { autoSubscribed } },
      ) => {
        // always remove
        state.selectedAuthorities = state.selectedAuthorities.filter(
          ({ internal_id }) => internal_id !== authority.internal_id,
        );
        // add if needed
        if (overrideValue) {
          state.selectedAuthorities.push(authority);
          state.autoSubscription.active = false; // after we subscribe, for any reason, prevent auto-subscribing
        }

        // Display banner that HA was auto-subscribed to
        if (autoSubscribed) {
          state.autoSubscription.bannerDismissed = false;
          state.autoSubscription.selectedAuthority = authority;
        }
      },
    )
    .addCase(
      toggleAutoSubscriptionBannerAction,
      (state, { payload: { overrideValue } }) => {
        state.autoSubscription.bannerDismissed = !overrideValue;
      },
    ),
);

export default healthcareAuthoritiesReducer;
