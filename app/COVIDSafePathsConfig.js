import Config from 'react-native-config';

export const config = {
  isGPS: Config.TRACING_STRATEGY === 'gps',
  tracingStrategy: Config.TRACING_STRATEGY,
};
