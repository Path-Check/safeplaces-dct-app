import React, { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Theme } from './app/constants/themes';
import { Entry } from './app/Entry';
import { FlagsProvider } from './app/helpers/Flags';
import { PermissionsProvider } from './app/PermissionsContext';
import VersionCheckService from './app/services/VersionCheckService';
import createStore from './app/store';

const { store, persistor } = createStore();

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    VersionCheckService.start();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <FlagsProvider>
          <MenuProvider>
            <Theme use='default'>
              <PermissionsProvider>
                <Entry />
              </PermissionsProvider>
            </Theme>
          </MenuProvider>
        </FlagsProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
