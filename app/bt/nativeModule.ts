import {
  NativeEventEmitter,
  NativeModules,
  EventSubscription,
} from 'react-native';

import { ENPermissionStatus } from './PermissionsContext';
import { ExposureInfo } from '../exposureHistory';
import { ENDiagnosisKey } from '../views/Settings/ENLocalDiagnosisKeyScreen';
import { RawExposure, toExposureInfo } from './exposureNotifications';
import { ExposureKey } from './AffectedUserFlow/exposureKey';

// Event Subscriptions
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

// Permissions Module
const permissionsModule = NativeModules.ENPermissionsModule;

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
const keySubmissionModule = NativeModules.KeySubmissionModule;

export const submitDiagnosisKeys = async (
  cb: (errorMessage: string, successMessage: string) => void,
): Promise<void> => {
  keySubmissionModule.postDiagnosisKeys(cb);
};

// Exposure Key Module
const exposureKeyModule = NativeModules.ExposureKeyModule;

export const getExposureKeys = async (): Promise<ExposureKey[]> => {
  const keys: RawExposureKey[] = await exposureKeyModule.fetchExposureKeys();
  return keys.map(toExposureKey);
};

interface RawExposureKey {
  key: null | string;
  rollingPeriod: number;
  rollingStartNumber: number;
  transmissionRisk: number;
}

const toExposureKey = (rawExposureKey: RawExposureKey): ExposureKey => {
  return {
    key: rawExposureKey.key || '',
    rollingPeriod: rawExposureKey.rollingPeriod,
    rollingStartNumber: rawExposureKey.rollingStartNumber,
    transmissionRisk: rawExposureKey.transmissionRisk,
  };
};

export const storeHMACKey = async (hmacKey: string): Promise<void> => {
  // exposureKeyModule.storeHMACKey(hmacKey);
  console.log('storing hmacKey', hmacKey);
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
