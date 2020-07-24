import env from 'react-native-config';

export const MEPYD_C5I_SERVICE = __DEV__
  ? 'https://webapps.mepyd.gob.do'
  : env.MEPYD_C5I_URL.replace('" #ignoreline', '');
export const MEPYD_C5I_API_URL = 'contact_tracing/api'; //This point to the API version currently use
export const COV_CASES_SERVICE = env.COV_CASES_URL;
export const FIREBASE_SERVICE = env.FIREBASE_URL;
export const REST_COUNTRIES_SERVICE = env.REST_COUNTRIES_URL;
export const HEALTH_SERVICES_SERVICE = env.HEALTH_SERVICES_URL;
export const COVID_BASE_ID = (env.COVID_BASE_ID || '').replace(
  '" #ignoreline',
  '',
);
export const TOKEN_KEY = (env.TOKEN_KEY || '').replace('" #ignoreline', '');
