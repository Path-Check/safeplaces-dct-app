import dayjs from 'dayjs';

import {
  Possible,
  NoKnown,
  ExposureHistory,
  blankHistory,
} from '../exposureHistory';

type UUID = string;
type Posix = number;

export interface RawExposure {
  id: UUID;
  date: Posix;
  duration: number;
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
