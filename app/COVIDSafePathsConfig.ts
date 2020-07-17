import env from 'react-native-config';
const { AUTHORITY_ADVICE_URL } = env;

export const isGPS = env.TRACING_STRATEGY === 'gps';
export const displaySelfAssessment = env.DISPLAY_SELF_ASSESSMENT === 'true';
export const displayNextSteps = displaySelfAssessment || AUTHORITY_ADVICE_URL;
