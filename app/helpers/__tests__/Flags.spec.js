import { getCleanedFlagName, mergeFlags } from '../Flags';

jest.mock('../../helpers/General', () => {
  return {
    GetStoreData: jest.fn(),
    SetStoreData: jest.fn(),
  };
});

describe('mergeFlags', () => {
  it('overwrites existing properties', () => {
    const oldFlags = { foo: 'bar' };
    const newFlags = { foo: 'baz' };
    expect(mergeFlags(oldFlags, newFlags)).toEqual(newFlags);
  });

  it('does not merge keys from `newFlags` that are not present on `oldFlags`', () => {
    const oldFlags = { foo: 'bar' };
    const newFlags = { baz: 'baz' };
    expect(mergeFlags(oldFlags, newFlags)).toEqual(oldFlags);
  });
});

describe('getCleanedFlagName', () => {
  it('removes underscores and capitalizes the first letter of each flag', () => {
    const flag = 'hello_world';
    expect(getCleanedFlagName(flag)).toBe('Hello world');
  });
});
