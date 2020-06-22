import React, { createContext, useState, useEffect } from 'react';

import * as BTNativeModule from './nativeModule';

type Enablement = `DISABLED` | `ENABLED`;
type Authorization = `UNAUTHORIZED` | `AUTHORIZED`;

export type DeviceStatus = [Authorization, Enablement];

interface ExposureNotificationsState {
  authorizationStatus: DeviceStatus;
  requestENAuthorization: () => void;
}

const initialStatus: DeviceStatus = ['UNAUTHORIZED', 'DISABLED'];

const initialState = {
  authorizationStatus: initialStatus,
  requestENAuthorization: () => {},
};

const ExposureNotificationsContext = createContext<ExposureNotificationsState>(
  initialState,
);

interface ExposureNotificationProviderProps {
  children: JSX.Element;
}

const ExposureNotificationsProvider = ({
  children,
}: ExposureNotificationProviderProps): JSX.Element => {
  const [authorizationStatus, setAuthorizationStatus] = useState<DeviceStatus>(
    initialStatus,
  );

  useEffect(() => {
    const subscription = BTNativeModule.subscribeToEnabledStatusEvents(
      (status: DeviceStatus) => {
        setAuthorizationStatus(status);
      },
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  const requestENAuthorization = () => {
    const cb = (authorizationStatus: DeviceStatus) => {
      setAuthorizationStatus(authorizationStatus);
    };
    BTNativeModule.requestAuthorization(cb);
  };

  return (
    <ExposureNotificationsContext.Provider
      value={{
        authorizationStatus,
        requestENAuthorization,
      }}>
      {children}
    </ExposureNotificationsContext.Provider>
  );
};

export { ExposureNotificationsProvider };
export default ExposureNotificationsContext;
