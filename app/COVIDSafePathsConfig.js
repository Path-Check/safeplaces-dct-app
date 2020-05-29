import Config from 'react-native-config';

export const config = {
  tracingStrategy: Config.TRACING_STRATEGY,
};

export const isGPS = config.tracingStrategy === 'gps';
