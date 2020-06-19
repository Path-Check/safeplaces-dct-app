import dayjs from 'dayjs';

export type Posix = number;

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

export type ExposureInfo = Record<Posix, ExposureDatum>;

export type ExposureHistory = ExposureDatum[];

export const toExposureHistory: (
  exposureInfo: ExposureInfo,
  calendary: Posix[],
) => ExposureHistory = (exposureInfo, calendar) => {
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

export const calendarDays = (today: Posix, totalDays: number): Posix[] => {
  const saturday = nextSaturday(today);

  const daysAgo = [...Array(totalDays)].map((_v, idx: number) => {
    return totalDays - 1 - idx;
  });

  return daysAgo.map(
    (daysAgo: number): Posix => {
      return dayjs(saturday).subtract(daysAgo, 'day').startOf('day').valueOf();
    },
  );
};

const nextSaturday = (date: Posix): Posix => {
  const saturdayDayOfWeek = 6;
  const dayOfWeek = dayjs(date).day();
  const daysUntilNextSaturday = saturdayDayOfWeek - dayOfWeek;
  return dayjs(date).add(daysUntilNextSaturday, 'day').valueOf();
};
