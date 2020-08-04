import { createAction } from '@reduxjs/toolkit';
import type { HealthcareAuthority } from '../../types';

type Payload = {
  authority: HealthcareAuthority;
  overrideValue: boolean;
};

type Meta = {
  triggerIntersect: boolean;
};

const TOGGLE_SELECTED_HEALTHCARE_AUTHORITY =
  'TOGGLE_SELECTED_HEALTHCARE_AUTHORITY';

const toggleSelectedHealthcareAuthorityAction = createAction(
  TOGGLE_SELECTED_HEALTHCARE_AUTHORITY,
  ({ authority, overrideValue }: Payload, { triggerIntersect }: Meta) => ({
    payload: { authority, overrideValue },
    meta: { triggerIntersect },
  }),
);

export default toggleSelectedHealthcareAuthorityAction;
