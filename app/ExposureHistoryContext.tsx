import React, { createContext, useState, useEffect } from 'react';

import {
  blankExposureHistory,
  ExposureHistory,
  ExposureCalendarOptions,
  ExposureInfo,
} from './exposureHistory';

import { useSelector } from 'react-redux';
import { RootState, FeatureFlagOption } from './store/types';
import { mockPossible } from './factories/exposureDatum';

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
const mockedHistory = blankHistory.map(mockPossible);

const ExposureHistoryProvider = ({
  children,
  exposureEventsStrategy,
}: ExposureHistoryProps): JSX.Element => {
  const {
    exposureInfoSubscription,
    toExposureHistory,
  } = exposureEventsStrategy;

  const featureFlags = useSelector(
    (state: RootState) => state.featureFlags?.flags || {},
  );
  const mockExposureNotification = !!featureFlags[
    FeatureFlagOption.MOCK_EXPOSURE
  ];
  const [exposureHistory, setExposureHistory] = useState<ExposureHistory>(
    mockExposureNotification ? mockedHistory : blankHistory,
  );

  const [userHasNewExposure, setUserHasNewExposure] = useState<boolean>(false);

  useEffect(() => {
    // in theory, useSelector should solve this, but the calendar screen never gets unmounted
    setExposureHistory(mockExposureNotification ? mockedHistory : blankHistory);
  }, [mockExposureNotification]);

  useEffect(() => {
    const subscription = exposureInfoSubscription(
      (exposureInfo: ExposureInfo) => {
        const exposureHistory = mockExposureNotification
          ? mockedHistory
          : toExposureHistory(exposureInfo, blankHistoryConfig);
        setExposureHistory(exposureHistory);
      },
    );

    return subscription.remove;
  }, [exposureInfoSubscription, toExposureHistory, mockExposureNotification]);

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
