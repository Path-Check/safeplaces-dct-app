import { assign } from 'lodash';
import React, { useEffect, useState } from 'react';

import { getBuildtimeFlags } from '../constants/flagsEnv';
import { FEATURE_FLAG_VALS } from '../constants/storage';
import { GetStoreData, SetStoreData } from './General';

/**
 * Converts the flag name from env into a more human readable form.
 *
 * Example:
 *
 * `getCleanedFlagName('hello_world')` becomes `Hello world`
 *
 */
export const getCleanedFlagName = (name) => {
  const withSpaces = name.replace('_', ' ');
  return (
    withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1, withSpaces.length)
  );
};

export const FlagsContext = React.createContext([
  getBuildtimeFlags(),
  () => {},
]);

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
  const buildTimeFlags = getBuildtimeFlags();
  const [flags, setFlags] = useState(buildTimeFlags);

  useEffect(() => {
    const getInitalFlagVals = async () => {
      const storedFlags = await GetStoreData(FEATURE_FLAG_VALS, false);

      if (storedFlags) {
        // Overwrite existing properties of `getBuildtimeFlags` with stored values from async storage,
        // omitting any stored value that is not present on `getBuildtimeFlags`.
        const initialFlags = mergeFlags(buildTimeFlags, storedFlags);
        setFlags(initialFlags);
        await SetStoreData(FEATURE_FLAG_VALS, initialFlags);
      }
    };

    getInitalFlagVals();
  }, [buildTimeFlags]);

  return (
    <FlagsContext.Provider value={[flags, setFlags]}>
      {children}
    </FlagsContext.Provider>
  );
};
