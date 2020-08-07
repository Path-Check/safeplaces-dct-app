import { createAction } from '@reduxjs/toolkit';

const TOGGLE_HEALTHCARE_AUTHORITY_AUTO_SUBSCRIPTION =
  'TOGGLE_HEALTHCARE_AUTHORITY_AUTO_SUBSCRIPTION';

const toggleHealthcareAuthorityAutoSubscription = createAction<{
  autoSubscriptionEnabled: boolean;
}>(TOGGLE_HEALTHCARE_AUTHORITY_AUTO_SUBSCRIPTION);

export default toggleHealthcareAuthorityAutoSubscription;
