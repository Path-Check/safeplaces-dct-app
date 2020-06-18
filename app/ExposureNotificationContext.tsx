import React, { createContext, useState, useEffect } from 'react';

import { isGPS } from './COVIDSafePathsConfig';
import { BTNativeModule } from './bt';

export type EnabledStatus = `DISABLED` | `ENABLED`;

interface ExposureNotificationsState {
  authorizationStatus: EnabledStatus;
  requestENAuthorization: () => void;
}

const initialStatus: EnabledStatus = 'DISABLED';

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
  const [authorizationStatus, setAuthorizationStatus] = useState<EnabledStatus>(
    initialStatus,
  );

  useEffect(() => {
    if (!isGPS) {
      const subscription = BTNativeModule.subscribeToEnabledStatusEvents(
        (status: EnabledStatus) => {
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
    const cb = (authorizationStatus: EnabledStatus) => {
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
