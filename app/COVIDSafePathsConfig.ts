import env from 'react-native-config';

export const isGPS = env.TRACING_STRATEGY === 'gps';
