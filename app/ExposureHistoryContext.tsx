import React, { createContext, useState, useEffect } from 'react';

import {
  blankExposureHistory,
  ExposureHistory,
  ExposureCalendarOptions,
  ExposureInfo,
} from './exposureHistory';

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

type ExposureInfoSubscription = (
  cb: (exposureInfo: ExposureInfo) => void,
) => { remove: () => void };

export interface ExposureEventsStrategy {
  exposureInfoSubscription: ExposureInfoSubscription;
  toExposureHistory: (
    exposureInfo: ExposureInfo,
    calendarOptions: ExposureCalendarOptions,
  ) => ExposureHistory;
}

interface ExposureHistoryProps {
  children: JSX.Element;
  exposureEventsStrategy: ExposureEventsStrategy;
}

const CALENDAR_DAY_COUNT = 21;

const blankHistoryConfig: ExposureCalendarOptions = {
  startDate: Date.now(),
  totalDays: CALENDAR_DAY_COUNT,
};

const blankHistory = blankExposureHistory(blankHistoryConfig);

const ExposureHistoryProvider = ({
  children,
  exposureEventsStrategy,
}: ExposureHistoryProps): JSX.Element => {
  const {
    exposureInfoSubscription,
    toExposureHistory,
  } = exposureEventsStrategy;
  const [exposureHistory, setExposureHistory] = useState<ExposureHistory>(
    blankHistory,
  );
  const [userHasNewExposure, setUserHasNewExposure] = useState<boolean>(false);

  useEffect(() => {
    const subscription = exposureInfoSubscription(
      (exposureInfo: ExposureInfo) => {
        const exposureHistory = toExposureHistory(
          exposureInfo,
          blankHistoryConfig,
        );
        setExposureHistory(exposureHistory);
      },
    );

    return subscription.remove;
  }, [exposureInfoSubscription, toExposureHistory]);

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
