import Config from 'react-native-config';
import { AUTHORITY_ADVICE_URL } from './constants/authorities';

export const isGPS = Config.TRACING_STRATEGY === 'gps';
export const displaySelfAssessment = Config.DISPLAY_SELF_ASSESSMENT === 'true'
export const displayNextSteps = displaySelfAssessment || AUTHORITY_ADVICE_URL
