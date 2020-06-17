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

export type ExposureHistory = ExposureDatum[];

export const blankHistory = (): NoKnown[] => {
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
