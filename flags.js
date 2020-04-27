import createFlags from 'flag';

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
function parseFlags(envConfig) {
  return Object.entries(envConfig)
    .filter(([key]) => key.toLowerCase().startsWith('flag'))
    .reduce((flags, [key, value]) => {
      const flag = key.replace(/^flag_/i, '');

      flags[flag] = value === 'true' || value === '1';
      return flags;
    }, {});
}

export { FlagsProvider, Flag, useFlag, useFlags, parseFlags };
