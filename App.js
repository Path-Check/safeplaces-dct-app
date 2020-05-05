import React, { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';

import { Theme } from './app/constants/themes';
import Entry from './app/Entry';
import { FlagsProvider, buildTimeFlags } from './app/helpers/flags';
import VersionCheckService from './app/services/VersionCheckService';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    VersionCheckService.start();
  }, []);

  return (
    <FlagsProvider flags={buildTimeFlags}>
      <MenuProvider>
        <Theme use='default'>
          <Entry />
        </Theme>
      </MenuProvider>
    </FlagsProvider>
  );
};

export default App;
