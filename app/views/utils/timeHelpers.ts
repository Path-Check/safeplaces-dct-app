import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(localizedFormat);

type Millis = number;

export const durationMsToString = (durationMs: Millis): string => {
  return dayjs.duration(durationMs).humanize(false);
};
