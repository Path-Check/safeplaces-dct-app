import { createAction } from '@reduxjs/toolkit';

const TOGGLE_ALLOW_FEATURE_FLAGS = 'TOGGLE_ALLOW_FEATURE_FLAGS';

/**
 * Enables / disables feature flags from being used
 */
const toggleAllowFeatureFlagsAction = createAction<{
  overrideValue: boolean;
}>(TOGGLE_ALLOW_FEATURE_FLAGS);

export default toggleAllowFeatureFlagsAction;
