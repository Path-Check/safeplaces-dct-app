import dayjs, { Dayjs } from 'dayjs';

export type Posix = number;

export const isToday = (date: Posix): boolean => {
  const now = Date.now();
  const beginningOfToday = beginningOfDay(now);
  const endOfToday = dayjs(now).endOf('day').valueOf();
  return beginningOfToday <= date && endOfToday >= date;
};

export const daysAgo = (days: number): Posix => {
  return dayjs(Date.now()).subtract(days, 'day').valueOf();
};

export const beginningOfDay = (date: Posix): Posix => {
  return dayjs(date).startOf('day').valueOf();
};

export const isInFuture = (date: Posix): boolean => {
  return date > Date.now();
};

export const posixToDayjs = (posixDate: Posix): Dayjs | null => {
  const dayJsDate = dayjs(posixDate);
  return dayJsDate.isValid() ? dayJsDate : null;
};
