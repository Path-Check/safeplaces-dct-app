import dayjs from 'dayjs';

type Posix = number;

export const isToday = (date: Posix): boolean => {
  const beginningOfDay = dayjs(Date.now()).startOf('day').valueOf();
  const endOfDay = dayjs(Date.now()).endOf('day').valueOf();
  return beginningOfDay <= date && endOfDay >= date;
};
