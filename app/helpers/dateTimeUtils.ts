import dayjs from 'dayjs';

export type Posix = number;

export const isToday = (date: Posix): boolean => {
  const now = Date.now();
  const beginningOfToday = beginningOfDay(now);
  const endOfToday = dayjs(now).endOf('day').valueOf();
  return beginningOfToday <= date && endOfToday >= date;
};

export const beginningOfDay = (date: Posix): Posix => {
  return dayjs(date).startOf('day').valueOf();
};

export const isInFuture = (date: Posix): boolean => {
  return date > Date.now();
};
