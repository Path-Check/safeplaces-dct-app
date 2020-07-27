import { createAction } from '@reduxjs/toolkit';
import type { HealthcareAuthority } from '../../types';
import { LocalDataPoint } from '../../../common/types';

const AUTO_SUBSCRIBE_TO_HEALTHCARE_AUTHORITY =
  'AUTO_SUBSCRIBE_TO_HEALTHCARE_AUTHORITY';

const healthcareAuthorityAutoSubscribeAction = createAction<{
  authority: HealthcareAuthority;
  autoSubscriptionLocation?: LocalDataPoint;
}>(AUTO_SUBSCRIBE_TO_HEALTHCARE_AUTHORITY);

export default healthcareAuthorityAutoSubscribeAction;
