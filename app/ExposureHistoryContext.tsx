import React, { createContext, useState, useEffect } from 'react';

import { isGPS } from './COVIDSafePathsConfig';
import { BTNativeModule } from './bt';

type Posix = number;

export interface Possible {
  kind: 'Possible';
  date: Posix;
  duration: number;
  totalRiskScore: number;
  transmissionRiskLevel: number;
}

export interface NoKnown {
  kind: 'NoKnown';
  date: Posix;
}

export type ExposureDatum = Possible | NoKnown;

export type ExposureHistory = ExposureDatum[];

interface ExposureHistoryState {
  exposureHistory: ExposureHistory;
  hasBeenExposed: boolean;
  userHasNewExposure: boolean;
  observeExposures: () => void;
  resetExposures: () => void;
}

const initialState = {
  exposureHistory: [],
  hasBeenExposed: false,
  userHasNewExposure: true,
  observeExposures: () => {},
  resetExposures: () => {},
};

const ExposureHistoryContext = createContext<ExposureHistoryState>(
  initialState,
);

interface ExposureHistoryProps {
  children: JSX.Element;
}

const ExposureHistoryProvider = ({
  children,
}: ExposureHistoryProps): JSX.Element => {
  const [exposureHistory, setExposureHistory] = useState<ExposureHistory>([]);
  const [userHasNewExposure, setUserHasNewExposure] = useState<boolean>(true);

  useEffect(() => {
    if (!isGPS) {
      const subscription = BTNativeModule.subscribeToExposureEvents(
        (exposureHistory: ExposureHistory) => {
          setExposureHistory(exposureHistory);
        },
      );

      return () => {
        subscription?.remove();
      };
    } else {
      return () => {};
    }
  }, []);

  const observeExposures = () => {
    setUserHasNewExposure(false);
  };

  const resetExposures = () => {
    setUserHasNewExposure(true);
  };

  const hasBeenExposed = false;
  return (
    <ExposureHistoryContext.Provider
      value={{
        exposureHistory,
        hasBeenExposed,
        userHasNewExposure,
        observeExposures,
        resetExposures,
      }}>
      {children}
    </ExposureHistoryContext.Provider>
  );
};

export { ExposureHistoryProvider };
export default ExposureHistoryContext;
