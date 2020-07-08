import dayjs from 'dayjs';

import {
  Possible,
  ExposureInfo,
  ExposureHistory,
  calendarDays,
  ExposureCalendarOptions,
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

export const toExposureHistory: (
  exposureInfo: ExposureInfo,
  calendarOptions: ExposureCalendarOptions,
) => ExposureHistory = (exposureInfo, calendarOptions) => {
  const { startDate, totalDays } = calendarOptions;
  const calendar = calendarDays(startDate, totalDays);
  return calendar.map((date: Posix) => {
    if (exposureInfo[date]) {
      return exposureInfo[date];
    } else {
      return {
        kind: 'NoKnown',
        date,
      };
    }
  });
};

export const toExposureInfo = (rawExposures: RawExposure[]): ExposureInfo => {
  return rawExposures.map(toPossible).reduce(groupByDate, {});
};

const toPossible = (r: RawExposure): Possible => {
  const beginningOfDay = (date: Posix) => dayjs(date).startOf('day');
  return {
    kind: 'Possible',
    date: beginningOfDay(r.date).valueOf(),
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

const groupByDate = (
  groupedExposures: Record<Posix, Possible>,
  exposure: Possible,
): Record<Posix, Possible> => {
  const date = exposure.date;
  if (groupedExposures[date]) {
    groupedExposures[date] = combinePossibles(groupedExposures[date], exposure);
  } else {
    groupedExposures[date] = exposure;
  }
  return groupedExposures;
};
