import React, { createContext, useState, useEffect } from 'react';

import {
  blankExposureHistory,
  ExposureHistory,
  ExposureCalendarOptions,
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

export type ExposureInfoSubscription = (
  cb: (exposureHistory: ExposureHistory) => void,
  calendarConfig: ExposureCalendarOptions,
) => { remove: () => void };

interface ExposureHistoryProps {
  children: JSX.Element;
  exposureInfoSubscription: ExposureInfoSubscription;
}

const CALENDAR_DAY_COUNT = 21;

const blankHistoryConfig: ExposureCalendarOptions = {
  initDate: Date.now(),
  totalDays: CALENDAR_DAY_COUNT,
};

const blankHistory = blankExposureHistory(blankHistoryConfig);

const ExposureHistoryProvider = ({
  children,
  exposureInfoSubscription,
}: ExposureHistoryProps): JSX.Element => {
  const [exposureHistory, setExposureHistory] = useState<ExposureHistory>(
    blankHistory,
  );
  const [userHasNewExposure, setUserHasNewExposure] = useState<boolean>(false);

  useEffect(() => {
    const subscription = exposureInfoSubscription(
      (exposureHistory: ExposureHistory) => {
        setExposureHistory(exposureHistory);
      },
      blankHistoryConfig,
    );

    return subscription.remove;
  }, [exposureInfoSubscription]);

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
