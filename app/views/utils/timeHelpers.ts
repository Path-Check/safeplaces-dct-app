import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(localizedFormat);

type DurationRoundedToFiveMinuteIncrement = number;

export const durationToString = (
  duration: DurationRoundedToFiveMinuteIncrement,
): string => {
  // Duration is in milliseconds
  // Native layer returns length of exposure in
  // 5 minute increments with a 30 minute maximum.
  // 1 is the smallest possible number of 5 minute increments,
  // so if we receive 1 from the native layer, we display "one minute"
  const durationMinutes = Math.max(duration / 1000 / 60, 1);
  return dayjs.duration({ minutes: durationMinutes }).humanize(false);
};
