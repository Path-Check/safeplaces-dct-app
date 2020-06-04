import React, { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';

import { Theme } from './app/constants/themes';
import { Entry } from './app/Entry';
import { ExposureNotificationsProvider } from './app/ExposureNotificationContext';
import { FlagsProvider } from './app/helpers/Flags';
import { PermissionsProvider } from './app/PermissionsContext';
import VersionCheckService from './app/services/VersionCheckService';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    VersionCheckService.start();
  }, []);

  return (
    <FlagsProvider>
      <MenuProvider>
        <Theme use='default'>
          <PermissionsProvider>
            <ExposureNotificationsProvider>
              <Entry />
            </ExposureNotificationsProvider>
          </PermissionsProvider>
        </Theme>
      </MenuProvider>
    </FlagsProvider>
  );
};

export default App;
