import { isToday } from './dateTimeUtils';

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
