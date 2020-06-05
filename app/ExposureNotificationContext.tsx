/*global JSX*/
import React, { createContext, useState } from 'react';

import * as ExposureNotifications from './exposureNotificationsNativeModule';

export type ENAuthorizationStatus = 'authorized' | 'notAuthorized';

interface ExposureNotificationsState {
  exposureNotificationAuthorizationStatus: ENAuthorizationStatus;
  requestExposureNotificationAuthorization: () => void;
}

const initialStatus: ENAuthorizationStatus = 'notAuthorized';

const ExposureNotificationsContext = createContext<ExposureNotificationsState>({
  exposureNotificationAuthorizationStatus: initialStatus,
  requestExposureNotificationAuthorization: () => {},
});

interface ExposureNotificationProviderProps {
  children: JSX.Element;
}

const ExposureNotificationsProvider = ({
  children,
}: ExposureNotificationProviderProps): JSX.Element => {
  const [
    exposureNotificationAuthorizationStatus,
    setExposureNotificationAuthorizationStatus,
  ] = useState<ENAuthorizationStatus>(initialStatus);

  const requestExposureNotificationAuthorization = () => {
    const cb = (authorizationStatus: ENAuthorizationStatus) => {
      setExposureNotificationAuthorizationStatus(authorizationStatus);
    };
    ExposureNotifications.requestAuthorization(cb);
  };

  return (
    <ExposureNotificationsContext.Provider
      value={{
        exposureNotificationAuthorizationStatus,
        requestExposureNotificationAuthorization,
      }}>
      {children}
    </ExposureNotificationsContext.Provider>
  );
};

export { ExposureNotificationsProvider };
export default ExposureNotificationsContext;
