import { isVersionGreater } from '../Util';

describe('Util class', () => {
  let versions;

  beforeEach(() => {
    versions = [
      ['0.0.1', '0.0.0', true],
      ['1.0.1', '0.9.9', true],
      ['3.0.0', '2.7.2+asdf', true],
      ['1.2.3-a.10', '1.2.3-a.5', true],
      ['1.2.3-a.b', '1.2.3-a', true],
      ['0.9.5', '1.0.1', false],
      ['0.9.9', '1.0.0', false],
      ['1.3.4', '1.3.5', false],
      ['2.9.1', '3.0.0', false],
      ['1.2.3', '1.2.3', false],
    ];
  });

  it('version greater than works', () => {
    versions.forEach(([v0, v1, expectedValue]) => {
      const result = isVersionGreater(v0, v1);
      expect(result).toBe(expectedValue);
    });
  });
});
