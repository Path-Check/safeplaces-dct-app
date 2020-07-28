import {
  NativeEventEmitter,
  NativeModules,
  EventSubscription,
} from 'react-native';

import { ENPermissionStatus } from './PermissionsContext';
import { ExposureInfo, Posix } from '../exposureHistory';
import { RawExposure, toExposureInfo } from './exposureNotifications';

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

export const fetchLastExposureDetectionDate = async (): Promise<Posix | null> => {
  try {
    return await exposureHistoryModule.fetchLastDetectionDate();
  } catch {
    return null;
  }
};
