import dayjs from 'dayjs';
import MockDate from 'mockdate';

import { convertToDailyMinutesExposed } from '../ExposureHistory';

describe('convertToDailyMinutesExposed', () => {
  const NOW = dayjs('2020-01-09T00:00:00-08:00');

  beforeEach(() => {
    MockDate.set(NOW.valueOf());
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('returns empty array if there is null history', () => {
    expect(convertToDailyMinutesExposed('null')).toEqual([]);
  });

  it('returns empty array if there is empty day bins', () => {
    expect(convertToDailyMinutesExposed('[]')).toEqual([]);
  });

  it('converts day bins to minutes', () => {
    expect(
      convertToDailyMinutesExposed('[0, 300000, 600000, 900000, 0]'),
    ).toEqual([
      { date: expect.any(dayjs), exposureMinutes: 0 },
      { date: expect.any(dayjs), exposureMinutes: 5 },
      { date: expect.any(dayjs), exposureMinutes: 10 },
      { date: expect.any(dayjs), exposureMinutes: 15 },
      { date: expect.any(dayjs), exposureMinutes: 0 },
    ]);
  });

  it('converts `daysAgo` index to daily date objects', () => {
    const day = convertToDailyMinutesExposed('[1, 1, 0]');

    const TODAY = NOW.startOf('day');

    expect(day[0].date.startOf('day').format()).toBe(TODAY.format());
    expect(day[1].date.startOf('day').format()).toBe(
      TODAY.subtract(1, 'day').format(),
    );
    expect(day[2].date.startOf('day').format()).toBe(
      TODAY.subtract(2, 'day').format(),
    );
  });
});
