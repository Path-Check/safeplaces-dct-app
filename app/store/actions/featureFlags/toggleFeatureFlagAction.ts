import { createAction } from '@reduxjs/toolkit';
import type { FeatureFlagOption } from '../../types';

const TOGGLE_FEATURE_FLAG = 'TOGGLE_FEATURE_FLAG';

/**
 * Toggle a specific feature flag.
 */
const toggleFeatureFlagAction = createAction<{
  flag: FeatureFlagOption;
  overrideValue: boolean;
}>(TOGGLE_FEATURE_FLAG);

export default toggleFeatureFlagAction;
