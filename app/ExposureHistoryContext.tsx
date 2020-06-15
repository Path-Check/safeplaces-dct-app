import React, { createContext, useState } from 'react';
import dayjs from 'dayjs';

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

interface ExposureHistoryState {
  exposureHistory: ExposureHistory;
  hasBeenExposed: boolean;
  userHasNewExposure: boolean;
  toggleHasExposure: () => void;
  observeExposures: () => void;
  resetExposures: () => void;
}

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
        possibleExposureTimeInMin: 124,
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
  exposureHistory: fakeExposureHistory,
  hasBeenExposed: false,
  userHasNewExposure: true,
  toggleHasExposure: () => {},
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
  const [hasBeenExposed, setHasBeenExposed] = useState<boolean>(false);
  const [userHasNewExposure, setUserHasNewExposure] = useState<boolean>(true);
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
    <ExposureHistoryContext.Provider
      value={{
        exposureHistory: fakeExposureHistory,
        hasBeenExposed,
        userHasNewExposure,
        toggleHasExposure,
        observeExposures,
        resetExposures,
      }}>
      {children}
    </ExposureHistoryContext.Provider>
  );
};

export { ExposureHistoryProvider };
export default ExposureHistoryContext;
