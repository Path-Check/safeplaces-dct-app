import { createAction } from '@reduxjs/toolkit';
import type { HealthcareAuthority } from '../../types';

type Payload = {
  authority: HealthcareAuthority;
  overrideValue: boolean;
};

type Meta = {
  triggerIntersect?: boolean; // indicates that this action should trigger a recomputation of possible exposure notifications
  autoSubscribed?: boolean; // indicates that this was triggered via geofencing auto subscription
};

const TOGGLE_SELECTED_HEALTHCARE_AUTHORITY =
  'TOGGLE_SELECTED_HEALTHCARE_AUTHORITY';

const toggleSelectedHealthcareAuthorityAction = createAction(
  TOGGLE_SELECTED_HEALTHCARE_AUTHORITY,
  (
    { authority, overrideValue }: Payload,
    { triggerIntersect, autoSubscribed }: Meta,
  ) => ({
    payload: { authority, overrideValue },
    meta: { triggerIntersect, autoSubscribed },
  }),
);

export default toggleSelectedHealthcareAuthorityAction;
