import React, { createContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  PERMISSIONS,
  check,
  checkNotifications,
  request,
  requestNotifications,
} from 'react-native-permissions';

import { isGPS } from './COVIDSafePathsConfig';
import { HCAService } from './services/HCAService';

export const PermissionStatus = {
  UNKNOWN: 0,
  GRANTED: 1,
  DENIED: 2,
};

const statusToEnum = (status) => {
  switch (status) {
    case 'unknown': {
      return PermissionStatus.UNKNOWN;
    }
    case 'denied': {
      return PermissionStatus.DENIED;
    }
    case 'blocked': {
      return PermissionStatus.DENIED;
    }
    case 'granted': {
      return PermissionStatus.GRANTED;
    }
    default: {
      return PermissionStatus.UNKNOWN;
    }
  }
};

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
};

const PermissionsContext = createContext(initialState);

const PermissionsProvider = ({ children }) => {
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
        isGPS ? checkLocationPermission() : null,
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
    } else if (Platform.OS === 'andriod') {
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

      setAuthSubscriptionPermission(statusToEnum(status));
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      requestLocationForPlatform(PERMISSIONS.IOS.LOCATION_ALWAYS);
    } else if (Platform.OS === 'android') {
      requestLocationForPlatform(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
  };

  const requestLocationForPlatform = async (permission) => {
    const status = await request(permission);
    setLocationPermission(statusToEnum(status));
  };

  const requestNotificationPermission = async () => {
    const { status } = await requestNotifications(['alert', 'sound']);
    setNotificationPermission(statusToEnum(status));
  };

  const requestAuthSubscriptionPermission = async () => {
    await HCAService.enableAutoSubscription();
    const status = PermissionStatus.GRANTED;
    setAuthSubscriptionPermission(status);
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
      }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export { PermissionsProvider };
export default PermissionsContext;
