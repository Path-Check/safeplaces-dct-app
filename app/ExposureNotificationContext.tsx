import React, { createContext, useState, useEffect } from 'react';

import { isGPS } from './COVIDSafePathsConfig';
import { BTNativeModule } from './bt';

export enum ENAuthorizationStatus {
  UNKNOWN = 0,
  RESTRICTED = 1,
  NOT_AUTHORIZED = 2,
  AUTHORIZED = 3,
}

interface ExposureNotificationsState {
  authorizationStatus: ENAuthorizationStatus;
  requestENAuthorization: () => void;
}

const initialStatus: ENAuthorizationStatus =
  ENAuthorizationStatus.NOT_AUTHORIZED;

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
  const [authorizationStatus, setAuthorizationStatus] = useState<
    ENAuthorizationStatus
  >(initialStatus);

  useEffect(() => {
    if (!isGPS) {
      const subscription = BTNativeModule.subscribeToENAuthorizationStatusEvents(
        (status: ENAuthorizationStatus) => {
          setAuthorizationStatus(status);
        },
      );

      return () => {
        subscription?.remove();
      };
    } else {
      return () => {};
    }
  }, []);

  const requestENAuthorization = () => {
    const cb = (authorizationStatus: ENAuthorizationStatus) => {
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
