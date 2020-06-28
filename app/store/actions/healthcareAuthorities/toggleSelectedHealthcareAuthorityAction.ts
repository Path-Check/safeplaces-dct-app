import { createAction } from '@reduxjs/toolkit';
import type { HealthcareAuthority } from '../../types';

const TOGGLE_SELECTED_HEALTHCARE_AUTHORITY =
  'TOGGLE_SELECTED_HEALTHCARE_AUTHORITY';

const toggleSelectedHealthcareAuthorityAction = createAction<{
  authority: HealthcareAuthority;
  overrideValue: boolean;
}>(TOGGLE_SELECTED_HEALTHCARE_AUTHORITY);

export default toggleSelectedHealthcareAuthorityAction;
