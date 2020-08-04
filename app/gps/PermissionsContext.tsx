import React, { createContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  PERMISSIONS,
  check,
  checkNotifications,
  request,
  requestNotifications,
  Permission,
} from 'react-native-permissions';
import { openSettings } from 'react-native-permissions';

import { PermissionStatus, statusToEnum } from '../permissionStatus';

interface PermissionContextState {
  location: {
    status: PermissionStatus;
    check: () => void;
    request: () => void;
  };
  notification: {
    status: PermissionStatus;
    check: () => void;
    request: () => void;
  };
  requestLocationSettings: () => void;
  requestNotificationSettings: () => void;
}

const initialState = {
  location: {
    status: PermissionStatus.UNKNOWN,
    check: () => {},
    request: () => {},
  },
  notification: {
    status: PermissionStatus.UNKNOWN,
    check: () => {},
    request: () => {},
  },
  requestLocationSettings: () => {},
  requestNotificationSettings: () => {},
};

const PermissionsContext = createContext<PermissionContextState>(initialState);

const PermissionsProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [locationPermission, setLocationPermission] = useState(
    PermissionStatus.UNKNOWN,
  );
  const [notificationPermission, setNotificationPermission] = useState(
    PermissionStatus.UNKNOWN,
  );

  useEffect(() => {
    const checkAllPermissions = async () => {
      const isiOS = Platform.OS === 'ios';
      await Promise.all([
        checkLocationPermission(),
        isiOS ? checkNotificationPermission() : null,
      ]);
    };
    checkAllPermissions();
  }, []);

  const checkLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const status = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
      setLocationPermission(statusToEnum(status));
    } else if (Platform.OS === 'android') {
      const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      setLocationPermission(statusToEnum(status));
    }
  };

  const checkNotificationPermission = async () => {
    const { status } = await checkNotifications();
    setNotificationPermission(statusToEnum(status));
  };

  const requestLocationPermission = async () => {
    let status;
    if (Platform.OS === 'ios') {
      status = await requestLocationForPlatform(
        PERMISSIONS.IOS.LOCATION_ALWAYS,
      );
    } else if (Platform.OS === 'android') {
      status = await requestLocationForPlatform(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
    }
    return status;
  };

  const requestLocationForPlatform = async (permission: Permission) => {
    const status = await request(permission);
    setLocationPermission(statusToEnum(status));
    return status;
  };

  const requestNotificationPermission = async () => {
    const { status } = await requestNotifications(['alert', 'sound']);
    setNotificationPermission(statusToEnum(status));
    return status;
  };

  const requestNotificationSettings = async () => {
    const status = await requestNotificationPermission();
    if (statusToEnum(status) === PermissionStatus.DENIED) {
      openSettings();
    }
  };

  const requestLocationSettings = async () => {
    const status = await requestLocationPermission();
    if (statusToEnum(status) === PermissionStatus.DENIED) {
      openSettings();
    }
  };

  return (
    <PermissionsContext.Provider
      value={{
        location: {
          status: locationPermission,
          check: checkLocationPermission,
          request: requestLocationPermission,
        },
        notification: {
          status: notificationPermission,
          check: checkNotificationPermission,
          request: requestNotificationPermission,
        },
        requestLocationSettings,
        requestNotificationSettings,
      }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export { PermissionsProvider };
export default PermissionsContext;
