import React, { createContext, useState, useEffect } from 'react';

import { isGPS } from './COVIDSafePathsConfig';
import { BTNativeModule } from './bt';

export type Status = `DISABLED` | `ENABLED`;

interface ExposureNotificationsState {
  authorizationStatus: Status;
  requestENAuthorization: () => void;
}

const initialStatus: Status = 'DISABLED';

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
  const [authorizationStatus, setAuthorizationStatus] = useState<Status>(
    initialStatus,
  );

  useEffect(() => {
    if (!isGPS) {
      const subscription = BTNativeModule.subscribeToEnabledStatusEvents(
        (status: Status) => {
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
    const cb = (authorizationStatus: Status) => {
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
