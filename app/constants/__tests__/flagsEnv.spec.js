import env from 'react-native-config';

import { parseFlags } from '../flagsEnv';

describe('parseFlags', () => {
  it('parses feature flags from the respective .env file into an object', () => {
    expect(parseFlags(env)).toEqual({ FOO_BAR: true });
  });

  it('removes items without `flag_` at beginning', () => {
    expect(parseFlags({ FOO_BAR: 'true' })).toEqual({});
  });

  it('removes `flag_` from key name', () => {
    expect(parseFlags({ FLAG_FOO_BAR: 'true' })).toEqual({ FOO_BAR: true });
  });

  it('sets values of 1 to true', () => {
    expect(parseFlags({ FLAG_FOO_BAR: '1' })).toEqual({ FOO_BAR: true });
  });
});
