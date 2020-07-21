import React, { createContext, useState, useEffect } from 'react';

import * as BTNativeModule from './nativeModule';

import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import { Platform } from 'react-native';
import { PermissionStatus, statusToEnum } from '../permissionStatus';

type ENEnablement = `DISABLED` | `ENABLED`;
type ENAuthorization = `UNAUTHORIZED` | `AUTHORIZED`;

export type ENPermissionStatus = [ENAuthorization, ENEnablement];

const initialENStatus: ENPermissionStatus = ['UNAUTHORIZED', 'DISABLED'];

interface PermissionContextState {
  notification: {
    status: PermissionStatus;
    check: () => void;
    request: () => void;
  };
  exposureNotifications: {
    status: ENPermissionStatus;
    check: () => void;
    request: () => void;
  };
}

const initialState = {
  notification: {
    status: PermissionStatus.UNKNOWN,
    check: () => {},
    request: () => {},
  },
  exposureNotifications: {
    status: initialENStatus,
    check: () => {},
    request: () => {},
  },
};

const PermissionsContext = createContext<PermissionContextState>(initialState);

interface ExposureNotificationProviderProps {
  children: JSX.Element;
}

const PermissionsProvider = ({
  children,
}: ExposureNotificationProviderProps): JSX.Element => {
  const [
    exposureNotificationsPermission,
    setExposureNotificationsPermission,
  ] = useState<ENPermissionStatus>(initialENStatus);

  const [notificationPermission, setNotificationPermission] = useState(
    PermissionStatus.UNKNOWN,
  );

  useEffect(() => {
    const subscription = BTNativeModule.subscribeToEnabledStatusEvents(
      (status: ENPermissionStatus) => {
        setExposureNotificationsPermission(status);
      },
    );

    const checkAllPermissions = async () => {
      const isiOS = Platform.OS === 'ios';
      await Promise.all([
        isiOS ? checkNotificationPermission() : null,
        checkENPermission(),
      ]);
    };

    checkAllPermissions();

    return () => {
      subscription?.remove();
    };
  }, []);

  const checkENPermission = () => {
    const handleNativeResponse = (status: ENPermissionStatus) => {
      setExposureNotificationsPermission(status);
    };
    BTNativeModule.getCurrentENPermissionsStatus(handleNativeResponse);
  };

  const checkNotificationPermission = async () => {
    const { status } = await checkNotifications();
    setNotificationPermission(statusToEnum(status));
  };

  const requestENPermission = () => {
    const handleNativeResponse = () => {};
    BTNativeModule.requestAuthorization(handleNativeResponse);
  };

  const requestNotificationPermission = async () => {
    const { status } = await requestNotifications(['alert', 'sound']);
    setNotificationPermission(statusToEnum(status));
    return status;
  };

  return (
    <PermissionsContext.Provider
      value={{
        notification: {
          status: notificationPermission,
          check: checkNotificationPermission,
          request: requestNotificationPermission,
        },
        exposureNotifications: {
          status: exposureNotificationsPermission,
          check: checkENPermission,
          request: requestENPermission,
        },
      }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export { PermissionsProvider };
export default PermissionsContext;
