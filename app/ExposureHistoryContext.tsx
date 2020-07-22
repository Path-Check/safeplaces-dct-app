import { Dayjs } from 'dayjs';

import { posixToDayjs } from './helpers/dateTimeUtils';
import { fetchLastExposureDetectionDate } from './bt/nativeModule';

import React, {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
  useCallback,
} from 'react';

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
  getCurrentExposures: () => void;
  lastExposureDetectionDate: Dayjs | null;
}

const initialState = {
  exposureHistory: [],
  hasBeenExposed: false,
  userHasNewExposure: true,
  observeExposures: (): void => {},
  resetExposures: (): void => {},
  getCurrentExposures: (): void => {},
  lastExposureDetectionDate: null,
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
  getCurrentExposures: (cb: (exposureInfo: ExposureInfo) => void) => void;
}

interface ExposureHistoryProps {
  exposureEventsStrategy: ExposureEventsStrategy;
}

const CALENDAR_DAY_COUNT = 21;

const blankHistoryConfig: ExposureCalendarOptions = {
  startDate: Date.now(),
  totalDays: CALENDAR_DAY_COUNT,
};

const blankHistory = blankExposureHistory(blankHistoryConfig);
const mockedHistory = blankHistory.map(mockPossible);

const ExposureHistoryProvider: FunctionComponent<ExposureHistoryProps> = ({
  children,
  exposureEventsStrategy,
}) => {
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
  const [
    lastExposureDetectionDate,
    setLastExposureDetectionDate,
  ] = useState<Dayjs | null>(null);

  const getLastExposureDetectionDate = useCallback(() => {
    fetchLastExposureDetectionDate().then((exposureDetectionDate) => {
      exposureDetectionDate &&
        setLastExposureDetectionDate(posixToDayjs(exposureDetectionDate));
    });
  }, []);

  const getCurrentExposures = useCallback(() => {
    const cb = (exposureInfo: ExposureInfo) => {
      const exposureHistory = toExposureHistory(
        exposureInfo,
        blankHistoryConfig,
      );
      setExposureHistory(exposureHistory);
    };
    exposureEventsStrategy.getCurrentExposures(cb);
  }, [toExposureHistory, exposureEventsStrategy]);

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
        getLastExposureDetectionDate();
        setExposureHistory(exposureHistory);
      },
    );
    getLastExposureDetectionDate();

    return subscription.remove;
  }, [
    exposureInfoSubscription,
    toExposureHistory,
    mockExposureNotification,
    getLastExposureDetectionDate,
  ]);

  useEffect(() => {
    getCurrentExposures();
  }, [toExposureHistory, getCurrentExposures]);

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
        getCurrentExposures,
        lastExposureDetectionDate,
      }}>
      {children}
    </ExposureHistoryContext.Provider>
  );
};

export { ExposureHistoryProvider, initialState };
export default ExposureHistoryContext;
