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

// Exposure History Module
const exposureHistoryModule = NativeModules.ExposureHistoryModule;
export const getCurrentExposures = async (
  cb: (exposureInfo: ExposureInfo) => void,
): Promise<void> => {
  exposureHistoryModule.getCurrentExposures((rawExposure: string) => {
    const rawExposures: RawExposure[] = JSON.parse(rawExposure);
    cb(toExposureInfo(rawExposures));
  });
};

// Exposure Key Module
const exposureKeyModule = NativeModules.ExposureKeyModule;

interface RawExposureKey {
  key: null | string;
  rollingPeriod: number;
  rollingStartNumber: number;
  transmissionRisk: number;
}

export const getExposureKeys = async (): Promise<ExposureKey[]> => {
  const keys: RawExposureKey[] = await exposureKeyModule.fetchExposureKeys();
  return keys.map(toExposureKey);
};

const toExposureKey = (rawExposureKey: RawExposureKey): ExposureKey => {
  return {
    key: rawExposureKey.key || '',
    rollingPeriod: rawExposureKey.rollingPeriod,
    rollingStartNumber: rawExposureKey.rollingStartNumber,
    transmissionRisk: rawExposureKey.transmissionRisk,
  };
};

export const submitDiagnosisKeys = async (
  certificate: string,
  hmacKey: string,
): Promise<'success'> => {
  return exposureKeyModule.postDiagnosisKeys(certificate, hmacKey);
};

// Debug Module
const debugModule = NativeModules.DebugMenuModule;

export const fetchDiagnosisKeys = async (): Promise<ENDiagnosisKey[]> => {
  return debugModule.fetchDiagnosisKeys();
};

export type ENModuleErrorMessage = string | null;
export type ENModuleSuccessMessage = string | null;

export const detectExposuresNow = async (): Promise<'success'> => {
  return debugModule.detectExposuresNow();
};

export const simulateExposure = async (): Promise<'success'> => {
  return debugModule.simulateExposure();
};

export const showLastProcessedFilePath = async (): Promise<string> => {
  return debugModule.showLastProcessedFilePath();
};

export const resetExposure = async (): Promise<'success'> => {
  return debugModule.resetExposure();
};

export const toggleExposureNotifications = async (): Promise<'success'> => {
  return debugModule.toggleExposureNotifications();
};

export const submitExposureKeys = async (): Promise<'success'> => {
  return debugModule.submitExposureKeys();
};

export const simulateExposureDetectionError = async (): Promise<'success'> => {
  return debugModule.simulateExposureDetectionError();
};

export const resetExposures = async (): Promise<'success'> => {
  return debugModule.resetExposures();
};
