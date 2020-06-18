import React, { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Theme } from './app/constants/themes';
import { isGPS } from './app/COVIDSafePathsConfig';
import { Entry } from './app/Entry';
import { ExposureNotificationsProvider } from './app/ExposureNotificationContext';
import { ExposureHistoryProvider } from './app/ExposureHistoryContext';
import { FlagsProvider } from './app/helpers/Flags';
import { PermissionsProvider } from './app/PermissionsContext';
import VersionCheckService from './app/services/VersionCheckService';
import { store, persistor } from './app/store';

// For snapshot testing. In tests, we provide a mock store wrapper if needed.
export const UnconnectedApp = () => (
  <FlagsProvider>
    <MenuProvider>
      <Theme use='default'>
        {isGPS ? (
          <PermissionsProvider>
            <ExposureHistoryProvider>
            <Entry />
            </ExposureHistoryProvider>
          </PermissionsProvider>
        ) : (
          <ExposureNotificationsProvider>
            <ExposureHistoryProvider>
              <Entry />
            </ExposureHistoryProvider>
          </ExposureNotificationsProvider>
        )}
      </Theme>
    </MenuProvider>
  </FlagsProvider>
);

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    VersionCheckService.start();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <UnconnectedApp />
      </PersistGate>
    </Provider>
  );
};

export default App;
