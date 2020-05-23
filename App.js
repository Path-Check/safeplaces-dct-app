import React, { useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';

import { DEVICE_ID } from './gps/app/constants/storage';
import { Theme } from './gps/app/constants/themes';
import Entry from './gps/app/Entry';
import { FlagsProvider } from './gps/app/helpers/Flags';
import { SetStoreData } from './gps/app/helpers/General';
import VersionCheckService from './gps/app/services/VersionCheckService';

const App = () => {
  useEffect(async () => {
    await SetStoreData(DEVICE_ID, DeviceInfo.getUniqueId());
    SplashScreen.hide();
    VersionCheckService.start();
  }, []);

  return (
    <FlagsProvider>
      <MenuProvider>
        <Theme use='default'>
          <Entry />
        </Theme>
      </MenuProvider>
    </FlagsProvider>
  );
};

export default App;
