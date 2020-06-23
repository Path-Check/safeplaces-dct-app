import React, { createContext, useState, useEffect } from 'react';

import * as BTNativeModule from './nativeModule';

type Enablement = `DISABLED` | `ENABLED`;
type Authorization = `UNAUTHORIZED` | `AUTHORIZED`;

export type DeviceStatus = [Authorization, Enablement];

interface ExposureNotificationsState {
  deviceStatus: DeviceStatus;
  requestENAuthorization: () => void;
}

const initialStatus: DeviceStatus = ['UNAUTHORIZED', 'DISABLED'];

const initialState = {
  deviceStatus: initialStatus,
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
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(initialStatus);

  useEffect(() => {
    const subscription = BTNativeModule.subscribeToEnabledStatusEvents(
      (status: DeviceStatus) => {
        setDeviceStatus(status);
      },
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  const requestENAuthorization = () => {
    const handleNativeResponse = () => {};
    BTNativeModule.requestAuthorization(handleNativeResponse);
  };

  return (
    <ExposureNotificationsContext.Provider
      value={{
        deviceStatus,
        requestENAuthorization,
      }}>
      {children}
    </ExposureNotificationsContext.Provider>
  );
};

export { ExposureNotificationsProvider };
export default ExposureNotificationsContext;
