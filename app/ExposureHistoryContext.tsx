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

const ExposureHistoryProvider: FunctionComponent<ExposureHistoryProps> = ({
  children,
  exposureEventsStrategy,
}) => {
  const {
    exposureInfoSubscription,
    toExposureHistory,
  } = exposureEventsStrategy;
  const [exposureHistory, setExposureHistory] = useState<ExposureHistory>(
    blankHistory,
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

  useEffect(() => {
    const subscription = exposureInfoSubscription(
      (exposureInfo: ExposureInfo) => {
        const exposureHistory = toExposureHistory(
          exposureInfo,
          blankHistoryConfig,
        );
        getLastExposureDetectionDate();

        setExposureHistory(exposureHistory);
      },
    );
    getLastExposureDetectionDate();

    return subscription.remove;
  }, [
    exposureInfoSubscription,
    toExposureHistory,
    getLastExposureDetectionDate,
  ]);

  const observeExposures = () => {
    setUserHasNewExposure(false);
  };

  const resetExposures = () => {
    setUserHasNewExposure(true);
  };

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
