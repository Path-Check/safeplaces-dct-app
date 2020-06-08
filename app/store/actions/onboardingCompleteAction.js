import { createAction } from '@reduxjs/toolkit';

const ONBOARDING_COMPLETE = 'ONBOARDING_COMPLETE';
const onboardingCompleteAction = createAction(ONBOARDING_COMPLETE);
export default onboardingCompleteAction;
