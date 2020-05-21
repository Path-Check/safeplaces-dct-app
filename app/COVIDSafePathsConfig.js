import { NativeModules } from 'react-native';

export const config = {
  tracingStrategy: NativeModules.COVIDSafePathsConfig.getTracingStrategy(),
};
