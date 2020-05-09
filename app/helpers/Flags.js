import { assign } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';

import { buildTimeFlags } from '../constants/flagsEnv';
import { FEATURE_FLAG_VALS } from '../constants/storage';
import { GetStoreData, SetStoreData } from './General';

/**
 * Converts the flag name from env into a more human readable form.
 *
 * Example:
 *
 * `getCleanedFlagName('hello_world')` becomes `Hello World`
 *
 */
export const getCleanedFlagName = name => {
  return name
    .split('_')
    .reduce((acc, word) => {
      return (
        acc + word.charAt(0).toUpperCase() + word.slice(1, word.length) + ' '
      );
    }, '')
    .slice(0, -1); // Remove trailing space
};

export const FlagsContext = React.createContext([buildTimeFlags, () => {}]);

/**
 * Overwrites properties of `oldFlags` with properties from `newFlags`,
 * omitting any properties from `newFlags` that don't exist on `oldFlags`
 *
 * Examples:
 *
 * `mergeFlags({feature1: false}, {feature1: true})` becomes `{feature1: true}`
 *
 * `mergeFlags({feature1: false}, {feature1: true, feature2: true})` becomes `{feature1: true}`
 */
export const mergeFlags = (oldFlags, newFlags) => {
  return assign(oldFlags, newFlags, (objectValue, sourceValue) => {
    if (objectValue) {
      return sourceValue;
    }
  });
};

export const FlagsProvider = ({ children }) => {
  const [flags, setFlags] = useState(buildTimeFlags);

  const getInitalFlagVals = async () => {
    const storedFlags = await GetStoreData(FEATURE_FLAG_VALS, false);

    if (storedFlags) {
      // Overwrite existing properties of `buildTimeFlags` with stored values from async storage,
      // omitting any stored value that is not present on `buildTimeFlags`.
      const initialFlags = mergeFlags(buildTimeFlags, storedFlags);
      setFlags(initialFlags);
      await SetStoreData(FEATURE_FLAG_VALS, initialFlags);
    }
  };

  useEffect(() => {
    getInitalFlagVals();
  }, []);

  return (
    <FlagsContext.Provider value={[flags, setFlags]}>
      {children}
    </FlagsContext.Provider>
  );
};

/**
 * Custom hook that can be used to fetch the list of all flags,
 * and to set the value for a particular flag.
 */
export function useFlags() {
  const [flags, setFlags] = useContext(FlagsContext);

  const setFlag = async (flagName, flagVal) => {
    const newFlags = { ...flags, [flagName]: flagVal };
    setFlags(newFlags);
    await SetStoreData(FEATURE_FLAG_VALS, newFlags);
  };

  return [flags, setFlag];
}
