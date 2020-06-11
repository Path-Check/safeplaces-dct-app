/*global JSX*/
import React, { createContext, useState } from 'react';

import * as ExposureNotifications from './exposureNotificationsNativeModule';

export type ENAuthorizationStatus = 'authorized' | 'notAuthorized';

interface ExposureNotificationsState {
  hasBeenExposed: boolean;
  toggleHasExposure: () => void;
  exposureNotificationAuthorizationStatus: ENAuthorizationStatus;
  requestExposureNotificationAuthorization: () => void;
}

const initialStatus: ENAuthorizationStatus = 'notAuthorized';

const ExposureNotificationsContext = createContext<ExposureNotificationsState>({
  hasBeenExposed: false,
  toggleHasExposure: () => {},
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
  const [hasBeenExposed, setHasBeenExposed] = useState<boolean>(false);

  const requestExposureNotificationAuthorization = () => {
    const cb = (authorizationStatus: ENAuthorizationStatus) => {
      setExposureNotificationAuthorizationStatus(authorizationStatus);
    };
    ExposureNotifications.requestAuthorization(cb);
  };

  const toggleHasExposure = () => {
    setHasBeenExposed(!hasBeenExposed);
  };

  return (
    <ExposureNotificationsContext.Provider
      value={{
        hasBeenExposed,
        toggleHasExposure,
        exposureNotificationAuthorizationStatus,
        requestExposureNotificationAuthorization,
      }}>
      {children}
    </ExposureNotificationsContext.Provider>
  );
};

export { ExposureNotificationsProvider };
export default ExposureNotificationsContext;
