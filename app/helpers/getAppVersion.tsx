import { getVersion, getBuildNumber } from 'react-native-device-info';
import { isPlatformiOS } from '../Util';

const getAppVersion = (): string => {
  const version = getVersion();
  // Append "ALPHA" to our iOS builds that are 1.0.0, as we use
  // a separate Alpha TestFlight that is always 1.0.0.
  // On android we include "ALPHA" directly in the version name.
  const isAlpha = version === '1.0.0';
  const appVersion = `${
    isAlpha && isPlatformiOS() ? 'ALPHA ' : ''
  }${version} (${getBuildNumber()})`;
  return appVersion;
};

export default getAppVersion;
