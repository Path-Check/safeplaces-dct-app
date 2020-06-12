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
  userHasNewExposure: boolean;
  toggleHasExposure: () => void;
  observeExposures: () => void;
  resetExposures: () => void;
  authorizationStatus: ENAuthorizationStatus;
  requestENAuthorization: () => void;
}

const initialStatus: ENAuthorizationStatus = 'notAuthorized';

const now: Posix = Date.now();

const daysAgo = [...Array(21)].map((_v, idx: number) => {
  return 20 - idx;
});

const fakeExposureHistory: ExposureHistory = daysAgo.map(
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

const initialState = {
  hasBeenExposed: false,
  userHasNewExposure: true,
  toggleHasExposure: () => {},
  observeExposures: () => {},
  resetExposures: () => {},
  exposureHistory: fakeExposureHistory,
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
  const [hasBeenExposed, setHasBeenExposed] = useState<boolean>(false);
  const [userHasNewExposure, setUserHasNewExposure] = useState<boolean>(true);

  const requestENAuthorization = () => {
    const cb = (authorizationStatus: ENAuthorizationStatus) => {
      setAuthorizationStatus(authorizationStatus);
    };
    ExposureNotifications.requestAuthorization(cb);
  };

  const toggleHasExposure = () => {
    setHasBeenExposed(!hasBeenExposed);
  };

  const observeExposures = () => {
    setUserHasNewExposure(false);
  };

  const resetExposures = () => {
    setUserHasNewExposure(true);
  };

  return (
    <ExposureNotificationsContext.Provider
      value={{
        exposureHistory: fakeExposureHistory,
        hasBeenExposed,
        toggleHasExposure,
        userHasNewExposure,
        observeExposures,
        resetExposures,
        authorizationStatus,
        requestENAuthorization,
      }}>
      {children}
    </ExposureNotificationsContext.Provider>
  );
};

export { ExposureNotificationsProvider };
export default ExposureNotificationsContext;
