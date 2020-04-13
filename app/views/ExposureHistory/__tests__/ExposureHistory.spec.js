import dayjs from 'dayjs';

import { convertToDailyMinutesExposed } from '../../ExposureHistory';

describe('convertToDailyMinutesExposed', () => {
  const TODAY = dayjs('2020-04-13T04:00:00.000Z');

  beforeEach(() => {
    jest
      .spyOn(global.Date, 'now')
      .mockReturnValue(new Date('2020-04-13T04:00:00.000Z').getTime());
  });

  it('converts day bins to minutes', () => {
    expect(convertToDailyMinutesExposed('[0, 1, 2, 3, 0]')).toEqual([
      { date: expect.any(dayjs), exposureMinutes: 0 },
      { date: expect.any(dayjs), exposureMinutes: 5 },
      { date: expect.any(dayjs), exposureMinutes: 10 },
      { date: expect.any(dayjs), exposureMinutes: 15 },
      { date: expect.any(dayjs), exposureMinutes: 0 },
    ]);
  });

  it('converts `daysAgo` index to daily date objects', () => {
    const history = convertToDailyMinutesExposed('[1, 1, 0]');

    expect(history[0].date.isSame(TODAY, 'day')).toBe(true);
    expect(history[1].date.isSame(TODAY.subtract(1, 'day'), 'day')).toBe(true);
    expect(history[2].date.isSame(TODAY.subtract(2, 'day'), 'day')).toBe(true);
  });
});
