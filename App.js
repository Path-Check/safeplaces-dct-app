import React, { useEffect } from 'react';
import Config from 'react-native-config';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';

import { Theme } from './app/constants/themes';
import Entry from './app/Entry';
import VersionCheckService from './app/services/VersionCheckService';
import { FlagsProvider, parseFlags } from './flags';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    VersionCheckService.start();
  }, []);

  console.log('config', Config);
  console.log('flags', parseFlags(Config));

  return (
    <FlagsProvider flags={parseFlags(Config)}>
      <MenuProvider>
        <Theme use='default'>
          <Entry />
        </Theme>
      </MenuProvider>
    </FlagsProvider>
  );
};

export default App;
