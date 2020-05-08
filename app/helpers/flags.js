import assign from 'lodash/merge';
import React, { useContext, useEffect, useState } from 'react';

import { buildTimeFlags } from '../constants/flagsEnv';
import { FEATURE_FLAG_VALS } from '../constants/storage';
import { GetStoreData, SetStoreData } from './General';

export const FlagsContext = React.createContext([buildTimeFlags, () => {}]);

export const mergeFlags = (oldFlags, newFlags) =>
  assign(oldFlags, newFlags, (objectValue, sourceValue) => {
    if (objectValue) {
      return sourceValue;
    }
  });

export const FlagsProvider = ({ children }) => {
  const [flags, setFlags] = useState(buildTimeFlags);

  const getInitalFlagVals = async () => {
    const storedFlags = await GetStoreData(FEATURE_FLAG_VALS, false);

    if (storedFlags) {
      // Overwrite existing properties of `buildTimeFlags` with stored values from async storage,
      // omitting any stored value that is not present on `buildTimeFlags`.
      setFlags(mergeFlags(buildTimeFlags, storedFlags));
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
