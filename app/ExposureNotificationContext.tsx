/*global JSX*/
import React, { createContext, useState } from 'react';
import dayjs from 'dayjs';

import * as ExposureNotifications from './exposureNotificationsNativeModule';

export type ENAuthorizationStatus = 'authorized' | 'notAuthorized';

type Posix = number;

export interface Possible {
  kind: 'Possible';
  id: string;
  date: Posix;
  possibleExposureTimeInMin: number;
  currentDailyReports: number;
}

export interface NoKnown {
  kind: 'NoKnown';
  id: string;
  date: Posix;
}

export interface Unknown {
  kind: 'Unknown';
  id: string;
  date: Posix;
}

export type ExposureDatum = Possible | NoKnown | Unknown;

export type ExposureHistory = ExposureDatum[];

interface ExposureNotificationsState {
  exposureHistory: ExposureHistory;
  hasBeenExposed: boolean;
  toggleHasExposure: () => void;
  exposureNotificationAuthorizationStatus: ENAuthorizationStatus;
  requestExposureNotificationAuthorization: () => void;
}

const initialStatus: ENAuthorizationStatus = 'notAuthorized';

const now: Posix = Date.now();

const daysAgo = [...Array(21)].map((_v, idx: number) => {
  return 20 - idx;
});

const initialExposureHistory: ExposureHistory = daysAgo.map(
  (daysAgo: number): ExposureDatum => {
    const date = dayjs(now).subtract(daysAgo, 'day').valueOf();
    if (daysAgo > 10) {
      return {
        kind: 'Unknown',
        id: daysAgo.toString(),
        date,
      };
    } else if (daysAgo === 3) {
      return {
        kind: 'Possible',
        id: daysAgo.toString(),
        date,
        possibleExposureTimeInMin: 45,
        currentDailyReports: 1,
      };
    } else {
      return {
        kind: 'NoKnown',
        id: daysAgo.toString(),
        date,
      };
    }
  },
);

const ExposureNotificationsContext = createContext<ExposureNotificationsState>({
  hasBeenExposed: false,
  toggleHasExposure: () => {},
  exposureHistory: initialExposureHistory,
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
        exposureHistory: initialExposureHistory,
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
