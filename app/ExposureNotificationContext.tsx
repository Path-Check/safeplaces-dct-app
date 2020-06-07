/*global JSX*/
import React, { createContext, useState } from 'react';

import * as ExposureNotifications from './exposureNotificationsNativeModule';

export type ENAuthorizationStatus = 'authorized' | 'notAuthorized';
export type ENDiagnosisKey = {
  rollingStartNumber: number;
};

interface ExposureNotificationsState {
  exposureNotificationAuthorizationStatus: ENAuthorizationStatus;
  requestExposureNotificationAuthorization: () => void;
  fetchDiagnosisKeys: () => void;
  diagnosisKeys: ENDiagnosisKey[];
}

const initialStatus: ENAuthorizationStatus = 'notAuthorized';
const initialKeys: ENDiagnosisKey[] = [];

const ExposureNotificationsContext = createContext<ExposureNotificationsState>({
  exposureNotificationAuthorizationStatus: initialStatus,
  requestExposureNotificationAuthorization: () => {},
  fetchDiagnosisKeys: () => {},
  diagnosisKeys: [],
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

  const [diagnosisKeys, setDiagnosisKeys] = useState<ENDiagnosisKey[]>(
    initialKeys,
  );

  const requestExposureNotificationAuthorization = () => {
    const cb = (authorizationStatus: ENAuthorizationStatus) => {
      setExposureNotificationAuthorizationStatus(authorizationStatus);
    };
    ExposureNotifications.requestAuthorization(cb);
  };

  const fetchDiagnosisKeys = () => {
    const cb = (error: Error, diagnosisKeys: ENDiagnosisKey[]) => {
      console.log('number ' + diagnosisKeys[0].rollingStartNumber);
      setDiagnosisKeys(diagnosisKeys);
    };
    ExposureNotifications.fetchDiagnosisKeys(cb);
  };

  return (
    <ExposureNotificationsContext.Provider
      value={{
        exposureNotificationAuthorizationStatus,
        requestExposureNotificationAuthorization,
        fetchDiagnosisKeys,
        diagnosisKeys,
      }}>
      {children}
    </ExposureNotificationsContext.Provider>
  );
};

export { ExposureNotificationsProvider };
export default ExposureNotificationsContext;
