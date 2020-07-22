import { createReducer } from '@reduxjs/toolkit';
import { FeatureFlagOption } from '../types';

import toggleAllowFeatureFlagsEnabledAction from '../actions/featureFlags/toggleAllowFeatureFlagsEnabledAction';
import toggleFeatureFlagAction from '../actions/featureFlags/toggleFeatureFlagAction';

const AllFlagsOff: Record<FeatureFlagOption, boolean> = {
  [FeatureFlagOption.IMPORT_LOCATIONS_GOOGLE]: false,
  [FeatureFlagOption.IMPORT_LOCATIONS_JSON_URL]: false,
  [FeatureFlagOption.CUSTOM_URL]: false,
  [FeatureFlagOption.DOWNLOAD_LOCALLY]: false,
  [FeatureFlagOption.DEV_LANGUAGES]: false,
  [FeatureFlagOption.BYPASS_EXPORT_API]: false,
  [FeatureFlagOption.MOCK_EXPOSURE]: false,
};

const initialState = {
  enableFlags: false,
  flags: AllFlagsOff,
};

const featureFlagsReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(
      toggleAllowFeatureFlagsEnabledAction,
      (state, { payload: { overrideValue } }) => {
        state.enableFlags = overrideValue;
        // Reset flags while enabling / disabling. this alleviates issues from migrations not including new flags
        state.flags = AllFlagsOff;
      },
    )
    .addCase(
      toggleFeatureFlagAction,
      (state, { payload: { flag, overrideValue } }) => {
        state.flags[flag] = overrideValue;
      },
    ),
);

export default featureFlagsReducer;
