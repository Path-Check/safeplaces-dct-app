import { createAction } from '@reduxjs/toolkit';

import { Dispatch } from 'redux';

import { AppThunk } from '../../types';
import getHealthcareAuthoritiesApi from '../../../api/healthcareAuthorities/getHealthcareAuthoritiesApi';
import { Coordinates, HealthcareAuthority } from '../../../common/types';
import { isLocationWithinBounds } from '../../../helpers/autoSubscribe';
import toggleSelectedHealthcareAuthorityAction from './toggleSelectedHealthcareAuthorityAction';

const GET_HEALTHCARE_AUTHORITIES_STARTED = 'GET_HEALTHCARE_AUTHORITIES_STARTED';
const GET_HEALTHCARE_AUTHORITIES_SUCCESS = 'GET_HEALTHCARE_AUTHORITIES_SUCCESS';
const GET_HEALTHCARE_AUTHORITIES_FAILURE = 'GET_HEALTHCARE_AUTHORITIES_FAILURE';

const getHealthcareAuthorities_started = createAction(
  GET_HEALTHCARE_AUTHORITIES_STARTED,
);

type Payload = {
  healthcareAuthorities: HealthcareAuthority[];
  usesCustomUrl: boolean;
};

type GetHAActionOptions = {
  customYamlUrl?: string;
  autoSubscriptionLocation?: Coordinates;
};

const getHealthcareAuthorities_success = createAction(
  GET_HEALTHCARE_AUTHORITIES_SUCCESS,
  ({ healthcareAuthorities, usesCustomUrl }: Payload) => ({
    payload: { healthcareAuthorities, usesCustomUrl },
  }),
);
const getHealthcareAuthorities_failure = createAction(
  GET_HEALTHCARE_AUTHORITIES_FAILURE,
  ({ error }) => ({ payload: {}, meta: { error } }),
);

const getHealthcareAuthoritiesAction = (
  actionOptions?: GetHAActionOptions,
): AppThunk<void> => async (dispatch: Dispatch): Promise<void> => {
  dispatch(getHealthcareAuthorities_started());
  const { customYamlUrl, autoSubscriptionLocation } = actionOptions || {};

  try {
    const healthcareAuthorities = await getHealthcareAuthoritiesApi(
      customYamlUrl,
    );
    dispatch(
      getHealthcareAuthorities_success({
        healthcareAuthorities,
        usesCustomUrl: !!customYamlUrl, // Hack to hijack this action for custom YAML configs. This is for testing only.
      }),
    );

    if (autoSubscriptionLocation) {
      const localHealthAuthority = healthcareAuthorities.find((ha) =>
        isLocationWithinBounds(ha, autoSubscriptionLocation),
      );

      if (localHealthAuthority) {
        dispatch(
          toggleSelectedHealthcareAuthorityAction(
            { authority: localHealthAuthority, overrideValue: true },
            {
              triggerIntersect: false,
              autoSubscribed: !!autoSubscriptionLocation,
            },
          ),
        );
      }
    }
  } catch (error) {
    dispatch(getHealthcareAuthorities_failure({ error }));
  }
};

// Export the thunk as the default. This is to be consumed by any dispatched components.
export default getHealthcareAuthoritiesAction;

// Export the actions themselves to be used for reducer keys.
export {
  getHealthcareAuthorities_started,
  getHealthcareAuthorities_success,
  getHealthcareAuthorities_failure,
};
