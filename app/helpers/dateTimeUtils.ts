import dayjs from 'dayjs';

type Posix = number;

export const isToday = (date: Posix): boolean => {
  const endOfDay = dayjs(Date.now()).endOf('day').valueOf();
  return beginningOfDay(date) <= date && endOfDay >= date;
};

export const beginningOfDay = (date: Posix): Posix => {
  return dayjs(date).startOf('day').valueOf();
};
