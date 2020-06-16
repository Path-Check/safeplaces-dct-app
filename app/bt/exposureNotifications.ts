import dayjs from 'dayjs';

import { Possible, NoKnown, ExposureHistory } from '../ExposureHistoryContext';

type Posix = number;
type UUID = string;

export interface RawExposure {
  date: Posix;
  duration: number;
  id: UUID;
  totalRiskScore: number;
  transmissionRiskLevel: number;
}

export const toExposureHistory = (
  rawExposures: RawExposure[],
): ExposureHistory => {
  const possibleExposures = rawExposures.map(toPossible);
  const byDate = groupedByDate(possibleExposures, combinePossibles);

  const base = blankHistory();

  return base.map((datum: NoKnown) => {
    const date = datum.date;
    if (byDate[date]) {
      return byDate[date];
    } else {
      return datum;
    }
  });
};

const toPossible = (r: RawExposure): Possible => {
  const beginngingOfDay = (date: Posix) => dayjs(date).startOf('day');
  return {
    kind: 'Possible',
    date: beginngingOfDay(r.date).valueOf(),
    duration: r.duration,
    transmissionRiskLevel: r.transmissionRiskLevel,
    totalRiskScore: r.totalRiskScore,
  };
};

const combinePossibles = (a: Possible, b: Possible): Possible => {
  return {
    ...a,
    duration: a.duration + b.duration,
    totalRiskScore: Math.max(a.totalRiskScore, b.totalRiskScore),
    transmissionRiskLevel: Math.max(
      a.transmissionRiskLevel,
      b.transmissionRiskLevel,
    ),
  };
};

const groupedByDate = (
  exposures: Possible[],
  combine: (a: Possible, b: Possible) => Possible,
): Record<Posix, Possible> => {
  return exposures.reduce<Record<Posix, Possible>>((result, exposure) => {
    const date = exposure.date;
    if (result[date]) {
      result[date] = combine(result[date], exposure);
    } else {
      result[date] = exposure;
    }
    return result;
  }, {});
};

const blankHistory = (): NoKnown[] => {
  const now = Date.now();
  const daysAgo = [...Array(21)].map((_v, idx: number) => {
    return 20 - idx;
  });

  return daysAgo.map(
    (daysAgo: number): NoKnown => {
      const date = dayjs(now).subtract(daysAgo, 'day').startOf('day').valueOf();
      return {
        kind: 'NoKnown',
        date,
      };
    },
  );
};
