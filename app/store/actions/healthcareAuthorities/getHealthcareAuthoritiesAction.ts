import { createAction } from '@reduxjs/toolkit';

import { Dispatch } from 'redux';

import { AppThunk } from '../../types';
import getHealthcareAuthoritiesApi, {
  HealthcareAuthority,
} from '../../../api/healthcareAuthorities/getHealthcareAuthoritiesApi';

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
  customYamlUrl?: string,
): AppThunk<void> => async (dispatch: Dispatch): Promise<void> => {
  dispatch(getHealthcareAuthorities_started());
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
