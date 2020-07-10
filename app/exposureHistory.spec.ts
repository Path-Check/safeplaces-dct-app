import dayjs from 'dayjs';

import { DateTimeUtils } from './helpers';
import { calendarDays } from './exposureHistory';

describe('calendarDays', () => {
  describe('when today is monday and 21 days are requested', () => {
    it('returns a list of 21 consecutive days, ending at the next saturday', () => {
      const monday = dayjs('2020-06-22').valueOf();

      const result = calendarDays(monday, 21);

      const lastDay = result[result.length - 1];
      const firstDay = result[0];
      expect(result.length).toBe(21);
      expect(posixToString(lastDay)).toBe('2020-06-27');
      expect(posixToString(firstDay)).toBe('2020-06-07');
    });
  });

  describe('when today is saturday and 21 days are requested', () => {
    it('returns a list of 21 consecutive days, ending on today', () => {
      const saturday = dayjs('2020-06-27').valueOf();

      const result = calendarDays(saturday, 21);

      const lastDay = result[result.length - 1];
      const firstDay = result[0];
      expect(result.length).toBe(21);
      expect(posixToString(lastDay)).toBe('2020-06-27');
      expect(posixToString(firstDay)).toBe('2020-06-07');
    });
  });
});

const posixToString = (date: DateTimeUtils.Posix): string => {
  return dayjs(date).format('YYYY-MM-DD');
};
