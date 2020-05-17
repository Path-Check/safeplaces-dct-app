import React, { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';

import { Theme } from './gps/app/constants/themes';
import Entry from './gps/app/Entry';
import { FlagsProvider } from './gps/app/helpers/Flags';
import VersionCheckService from './gps/app/services/VersionCheckService';

const App = () => {
  useEffect(() => {
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
