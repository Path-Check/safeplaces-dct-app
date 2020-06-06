/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createAction } from '@reduxjs/toolkit';
import Yaml from 'js-yaml';

import { AUTHORITIES_LIST_URL_MVP1 } from '../../../constants/authorities';

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

const getHealthcareAuthoritiesApi = async () => {
  const yamlString = await fetch(AUTHORITIES_LIST_URL_MVP1).then((res) =>
    res.text(),
  );
  const { authorities } = Yaml.safeLoad(yamlString);
  if (!Array.isArray(authorities)) {
    throw new Error('authorities yaml did not return an array of authorities');
  }
  return authorities;
};

const getHealthcareAuthoritiesAction = () => async (dispatch: any) => {
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
