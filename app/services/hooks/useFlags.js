import { useContext } from 'react';

import { FEATURE_FLAG_VALS } from '../../constants/flagsEnv';
import { FlagsContext } from '../../helpers/Flags';
import { SetStoreData } from '../../helpers/General';

/**
 * Can be used to fetch the list of all flags,
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
