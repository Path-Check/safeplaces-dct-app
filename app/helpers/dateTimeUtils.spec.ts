import { isToday, posixToDayjs } from './dateTimeUtils';

describe('isToday', () => {
  describe('when provided a posix that is today', () => {
    it('returns true', () => {
      const date = Date.now() + 1000;

      const result = isToday(date);

      expect(result).toBe(true);
    });
  });

  describe('when provided a posix from a few days ago', () => {
    it('returns false', () => {
      const date = Date.now() - 24 * 60 * 60 * 1000;

      const result = isToday(date);

      expect(result).toBe(false);
    });
  });

  describe('when provided a posix from a few days from now', () => {
    it('returns false', () => {
      const date = Date.now() + 24 * 60 * 60 * 1000;

      const result = isToday(date);

      expect(result).toBe(false);
    });
  });
});

describe('posixToDayjs', () => {
  it('converts a valid posix timestamp into a Dayjs instance', () => {
    const posixTimeStamp = new Date('2020/07/01').getTime();
    expect(posixToDayjs(posixTimeStamp)?.format('YYYY-MM-DD')).toEqual(
      '2020-07-01',
    );
  });

  it('returns null for an invalid posix timestamp', () => {
    expect(posixToDayjs(parseInt('not a valid int'))).toBeNull();
  });
});
