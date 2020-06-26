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

import { HCAService } from '../services/HCAService.js';
import { PermissionStatus, statusToEnum } from '../helpers/PermissionsHelpers';

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
  authSubscription: {
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
  authSubscription: {
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
  const [authSubscriptionPermission, setAuthSubscriptionPermission] = useState(
    PermissionStatus.UNKNOWN,
  );

  useEffect(() => {
    const checkAllPermissions = async () => {
      const isiOS = Platform.OS === 'ios';
      const isDev = __DEV__;
      await Promise.all([
        checkLocationPermission(),
        isiOS ? checkNotificationPermission() : null,
        // TODO(https://pathcheck.atlassian.net/browse/SAF-232): Put HCA auto sub logic behind a feature flag
        isDev && isiOS ? checkAuthSubscriptionPermission() : null,
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

  const checkAuthSubscriptionPermission = async () => {
    const hasUserSetSubscription = await HCAService.hasUserSetSubscription();

    // TODO(https://pathcheck.atlassian.net/browse/SAF-487): Figure this out
    // Only update state if the user has already set their subscription status
    if (hasUserSetSubscription) {
      const isEnabled = await HCAService.isAutosubscriptionEnabled();
      const status = isEnabled
        ? PermissionStatus.GRANTED
        : PermissionStatus.DENIED;

      setAuthSubscriptionPermission(status);
    }
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

  const requestAuthSubscriptionPermission = async () => {
    await HCAService.enableAutoSubscription();
    const status = PermissionStatus.GRANTED;
    setAuthSubscriptionPermission(status);
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
        authSubscription: {
          status: authSubscriptionPermission,
          check: checkAuthSubscriptionPermission,
          request: requestAuthSubscriptionPermission,
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
