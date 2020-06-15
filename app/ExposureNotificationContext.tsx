import React, { createContext, useState } from 'react';

import * as ExposureNotifications from './exposureNotificationsNativeModule';

export type ENAuthorizationStatus = 'authorized' | 'notAuthorized';

interface ExposureNotificationsState {
  authorizationStatus: ENAuthorizationStatus;
  requestENAuthorization: () => void;
}

const initialStatus: ENAuthorizationStatus = 'notAuthorized';

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

  const requestENAuthorization = () => {
    const cb = (authorizationStatus: ENAuthorizationStatus) => {
      setAuthorizationStatus(authorizationStatus);
    };
    ExposureNotifications.requestAuthorization(cb);
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
