import {
  NativeEventEmitter,
  NativeModules,
  EventSubscription,
} from 'react-native';

import { ENPermissionStatus } from './PermissionsContext';
import { ExposureInfo } from '../exposureHistory';
import { ENDiagnosisKey } from '../views/Settings/ENLocalDiagnosisKeyScreen';
import { RawExposure, toExposureInfo } from './exposureNotifications';

export const subscribeToExposureEvents = (
  cb: (exposureInfo: ExposureInfo) => void,
): EventSubscription => {
  const ExposureEvents = new NativeEventEmitter(
    NativeModules.ExposureEventEmitter,
  );
  return ExposureEvents.addListener(
    'onExposureRecordUpdated',
    (rawExposure: string) => {
      const rawExposures: RawExposure[] = JSON.parse(rawExposure);
      cb(toExposureInfo(rawExposures));
    },
  );
};

export const subscribeToEnabledStatusEvents = (
  cb: (status: ENPermissionStatus) => void,
): EventSubscription => {
  const ExposureEvents = new NativeEventEmitter(
    NativeModules.ExposureEventEmitter,
  );
  return ExposureEvents.addListener(
    'onEnabledStatusUpdated',
    (data: string[]) => {
      const status = toStatus(data);
      cb(status);
    },
  );
};

const toStatus = (data: string[]): ENPermissionStatus => {
  const networkAuthorization = data[0];
  const networkEnablement = data[1];
  const result: ENPermissionStatus = ['UNAUTHORIZED', 'DISABLED'];
  if (networkAuthorization === 'AUTHORIZED') {
    result[0] = 'AUTHORIZED';
  }
  if (networkEnablement === 'ENABLED') {
    result[1] = 'ENABLED';
  }
  return result;
};

const permissionsModule = NativeModules.ENPermissionsModule;
const keySubmissionModule = NativeModules.KeySubmissionModule;
const exposureHistoryModule = NativeModules.ExposureHistoryModule;

// Permissions Module
export const requestAuthorization = async (
  cb: (data: string) => void,
): Promise<void> => {
  permissionsModule.requestExposureNotificationAuthorization(cb);
};

export const getCurrentENPermissionsStatus = async (
  cb: (status: ENPermissionStatus) => void,
): Promise<void> => {
  permissionsModule.getCurrentENPermissionsStatus((data: string[]) => {
    const status = toStatus(data);
    cb(status);
  });
};

// Key Submission Module
export const submitDiagnosisKeys = async (
  cb: (errorMessage: string, successMessage: string) => void,
): Promise<void> => {
  keySubmissionModule.postDiagnosisKeys(cb);
};

// Exposure History
export const getCurrentExposures = async (
  cb: (exposureInfo: ExposureInfo) => void,
): Promise<void> => {
  exposureHistoryModule.getCurrentExposures((rawExposure: string) => {
    const rawExposures: RawExposure[] = JSON.parse(rawExposure);
    cb(toExposureInfo(rawExposures));
  });
};

// Debug Module
const debugModule = NativeModules.DebugMenuModule;

export const fetchDiagnosisKeys = async (
  cb: (errorMessage: string, diagnosisKeys: ENDiagnosisKey[]) => void,
): Promise<void> => {
  debugModule.fetchDiagnosisKeys(cb);
};

export type ENModuleErrorMessage = string | null;
export type ENModuleSuccessMessage = string | null;

export const detectExposuresNow = async (
  cb: (
    errorMessage: ENModuleErrorMessage,
    successMesage: ENModuleSuccessMessage,
  ) => void,
): Promise<void> => {
  debugModule.detectExposuresNow(cb);
};

export const simulateExposure = async (
  cb: (
    errorMessage: ENModuleErrorMessage,
    successMesage: ENModuleSuccessMessage,
  ) => void,
): Promise<void> => {
  debugModule.simulateExposure(cb);
};

export const resetExposure = async (
  cb: (
    errorMessage: ENModuleErrorMessage,
    successMesage: ENModuleSuccessMessage,
  ) => void,
): Promise<void> => {
  debugModule.resetExposure(cb);
};

export const toggleExposureNotifications = async (
  cb: (
    errorMessage: ENModuleErrorMessage,
    successMesage: ENModuleSuccessMessage,
  ) => void,
): Promise<void> => {
  debugModule.toggleExposureNotifications(cb);
};

export const resetExposureDetectionError = async (
  cb: (
    errorMessage: ENModuleErrorMessage,
    successMesage: ENModuleSuccessMessage,
  ) => void,
): Promise<void> => {
  debugModule.resetExposureDetectionError(cb);
};

export const getAndPostDiagnosisKeys = async (
  cb: (
    errorMessage: ENModuleErrorMessage,
    successMesage: ENModuleSuccessMessage,
  ) => void,
): Promise<void> => {
  debugModule.getAndPostDiagnosisKeys(cb);
};

export const simulateExposureDetectionError = async (
  cb: (
    errorMessage: ENModuleErrorMessage,
    successMesage: ENModuleSuccessMessage,
  ) => void,
): Promise<void> => {
  debugModule.simulateExposureDetectionError(cb);
};

export const resetExposures = async (
  cb: (
    errorMessage: ENModuleErrorMessage,
    successMesage: ENModuleSuccessMessage,
  ) => void,
): Promise<void> => {
  debugModule.resetExposures(cb);
};
