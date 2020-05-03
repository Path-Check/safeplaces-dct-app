import React, { useContext } from 'react';
import env from 'react-native-config';

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

export const buildTimeFlags = parseFlags(env);

export const FlagsContext = React.createContext([buildTimeFlags, () => {}]);

/**
 * Custom hook that can be used to fetch the list of all flags,
 * and to set the value for a particular flag.
 */
export function useFlags() {
  const [flags, setFlags] = useContext(FlagsContext);

  const setFlag = (flagName, flagVal) =>
    setFlags({ ...flags, [flagName]: flagVal });

  return [flags, setFlag];
}
