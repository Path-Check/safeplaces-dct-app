import React, { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';

import { Theme } from './gps/app/constants/themes';
import Entry from './gps/app/Entry';
import { FlagsProvider } from './gps/app/helpers/Flags';
import VersionCheckService from './gps/app/services/VersionCheckService';

enableScreens();

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    VersionCheckService.start();
  }, []);

  return (
    <FlagsProvider>
      <MenuProvider>
        <SafeAreaProvider>
          <Theme use='default'>
            <Entry />
          </Theme>
        </SafeAreaProvider>
      </MenuProvider>
    </FlagsProvider>
  );
};

export default App;
