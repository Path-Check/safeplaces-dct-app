import createFlags from 'flag';
import Config from 'react-native-config';

const { FlagsProvider, Flag, useFlag, useFlags } = createFlags();

/**
 * Normalizes flags:
 *
 * Example:
 *
 * `{ flag_a: 'true' }` becomes `{ a: true }`
 *
 * @param {{[key: string]: string}} envConfig
 */
export function parseFlags(envConfig) {
  return Object.entries(envConfig)
    .filter(([key]) => key.toLowerCase().startsWith('flag'))
    .reduce((flags, [key, value]) => {
      const flag = key.replace(/^flag_/i, '');

      flags[flag] = value === 'true' || value === '1';
      return flags;
    }, {});
}

export const flags = parseFlags(Config);

export { FlagsProvider, Flag, useFlag, useFlags };
