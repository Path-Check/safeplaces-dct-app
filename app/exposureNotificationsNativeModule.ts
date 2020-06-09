import { NativeModules } from 'react-native';

import { ENAuthorizationStatus } from './ExposureNotificationContext';
import { ENDiagnosisKey } from './views/Settings/ENLocalDiagnosisKeyScreen';

const exposureNotificationModule = NativeModules.PTCExposureManagerModule;
const debugModule = NativeModules.DebugMenuModule;

export const requestAuthorization = async (
  cb: (authorizationStatus: ENAuthorizationStatus) => void,
): Promise<void> => {
  exposureNotificationModule.requestExposureNotificationAuthorization(cb);
};

export const fetchDiagnosisKeys = async (
  cb: (errorMessage: string, diagnosisKeys: ENDiagnosisKey[]) => void,
): Promise<void> => {
  debugModule.fetchDiagnosisKeys(cb);
};

export type ENModuleError = string | null;

export const detectExposuresNow = async (
  cb: (error: ENModuleError) => void,
): Promise<void> => {
  debugModule.detectExposuresNow(cb);
};

export const simulateExposure = async (
  cb: (errorString: string | null) => void,
): Promise<void> => {
  debugModule.simulateExposure(cb);
};

export const simulatePositiveDiagnosis = async (
  cb: (errorString: string | null) => void,
): Promise<void> => {
  debugModule.simulatePositiveDiagnosis(cb);
};

export const disableExposureNotifications = async (
  cb: (errorString: string | null) => void,
): Promise<void> => {
  debugModule.disableExposureNotifications(cb);
};

export const resetExposureDetectionError = async (
  cb: (errorString: string | null) => void,
): Promise<void> => {
  debugModule.resetExposureDetectionError(cb);
};

export const resetLocalExposures = async (
  cb: (errorString: string | null) => void,
): Promise<void> => {
  debugModule.resetLocalExposures(cb);
};

export const getAndPostDiagnosisKeys = async (
  cb: (errorString: string | null) => void,
): Promise<void> => {
  debugModule.getAndPostDiagnosisKeys(cb);
};

export const simulateExposureDetectionError = async (
  cb: (errorString: string | null) => void,
): Promise<void> => {
  debugModule.simulateExposureDetectionError(cb);
};

export const getExposureConfiguration = async (
  cb: (errorString: string | null) => void,
): Promise<void> => {
  debugModule.getExposureConfiguration(cb);
};
