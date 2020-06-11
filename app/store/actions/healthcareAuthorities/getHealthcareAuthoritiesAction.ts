import { createAction } from '@reduxjs/toolkit';

import { Dispatch } from 'redux';

import { AppThunk } from '../../types';
import getHealthcareAuthoritiesApi from '../../../api/healthcareAuthorities/getHealthcareAuthoritiesApi';

const GET_HEALTHCARE_AUTHORITIES_STARTED = 'GET_HEALTHCARE_AUTHORITIES_STARTED';
const GET_HEALTHCARE_AUTHORITIES_SUCCESS = 'GET_HEALTHCARE_AUTHORITIES_SUCCESS';
const GET_HEALTHCARE_AUTHORITIES_FAILURE = 'GET_HEALTHCARE_AUTHORITIES_FAILURE';

const getHealthcareAuthorities_started = createAction(
  GET_HEALTHCARE_AUTHORITIES_STARTED,
);
const getHealthcareAuthorities_success = createAction(
  GET_HEALTHCARE_AUTHORITIES_SUCCESS,
  ({ healthcareAuthorities }) => ({ payload: { healthcareAuthorities } }),
);
const getHealthcareAuthorities_failure = createAction(
  GET_HEALTHCARE_AUTHORITIES_FAILURE,
  ({ error }) => ({ payload: {}, meta: { error } }),
);

const getHealthcareAuthoritiesAction = (): AppThunk<void> => async (
  dispatch: Dispatch,
): Promise<void> => {
  dispatch(getHealthcareAuthorities_started());
  try {
    const healthcareAuthorities = await getHealthcareAuthoritiesApi();
    dispatch(getHealthcareAuthorities_success({ healthcareAuthorities }));
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
