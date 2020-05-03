import React, { useEffect, useState } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';

import { Theme } from './app/constants/themes';
import Entry from './app/Entry';
import { FlagsContext, buildTimeFlags } from './app/helpers/flags';
import VersionCheckService from './app/services/VersionCheckService';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    VersionCheckService.start();
  }, []);

  return (
    <FlagsContext.Provider value={useState(buildTimeFlags)}>
      <MenuProvider>
        <Theme use='default'>
          <Entry />
        </Theme>
      </MenuProvider>
    </FlagsContext.Provider>
  );
};

export default App;
