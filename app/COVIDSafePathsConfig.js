import { NativeModules } from 'react-native';

const config = {
  tracingStrategy: NativeModules.COVIDSafePathsConfig.getTracingStrategy(),
};

export default config;
