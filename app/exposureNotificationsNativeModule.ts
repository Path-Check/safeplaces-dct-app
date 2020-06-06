import { NativeModules } from 'react-native';

import { ENAuthorizationStatus } from './ExposureNotificationContext';

const exposureNotificationModule = NativeModules.PTCExposureManagerModule;
const debugModule = NativeModules.DebugMenuModule;

export const requestAuthorization = async (
  cb: (authorizationStatus: ENAuthorizationStatus) => void,
): Promise<void> => {
  exposureNotificationModule.requestExposureNotificationAuthorization(cb);
};

export const detectExposuresNow = async (
  cb: (errorString: string) => void,
): Promise<void> => {
  debugModule.detectExposuresNow(cb);
};

export const simulateExposure = async (
  cb: (errorString: string) => void,
): Promise<void> => {
  debugModule.simulateExposure(cb);
};

export const simulatePositiveDiagnosis = async (
  cb: (errorString: string) => void,
): Promise<void> => {
  debugModule.simulatePositiveDiagnosis(cb);
};

export const disableExposureNotifications = async (
  cb: (errorString: string) => void,
): Promise<void> => {
  debugModule.disableExposureNotifications(cb);
};

export const resetExposureDetectionError = async (
  cb: (errorString: string) => void,
): Promise<void> => {
  debugModule.resetExposureDetectionError(cb);
};

export const resetLocalExposures = async (
  cb: (errorString: string) => void,
): Promise<void> => {
  debugModule.resetLocalExposures(cb);
};

export const getAndPostDiagnosisKeys = async (
  cb: (errorString: string) => void,
): Promise<void> => {
  debugModule.getAndPostDiagnosisKeys(cb);
};

export const simulateExposureDetectionError = async (
  cb: (errorString: string) => void,
): Promise<void> => {
  debugModule.simulateExposureDetectionError(cb);
};
