import { NativeModules } from 'react-native';

import { ENAuthorizationStatus } from './ExposureNotificationContext';

const exposureNotificationModule = NativeModules.PTCExposureManagerModule;

export const requestAuthorization = async (
  cb: (authorizationStatus: ENAuthorizationStatus) => void,
) => {
  exposureNotificationModule.requestExposureNotificationAuthorization(cb);
};
