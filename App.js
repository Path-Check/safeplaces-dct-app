import React, { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Config from 'react-native-config';
import 'array-flat-polyfill';

import { Theme } from './app/constants/themes';
import { Entry } from './app/Entry';
import { TracingStrategyProvider } from './app/TracingStrategyContext';
import VersionCheckService from './app/services/VersionCheckService';
import { store, persistor } from './app/store';
import btStrategy from './app/bt';
import gpsStrategy from './app/gps';

const determineTracingStrategy = () => {
  switch (Config.TRACING_STRATEGY) {
    case 'gps': {
      return gpsStrategy;
    }
    case 'bt': {
      return btStrategy;
    }
    default: {
      throw new Error('Unsupported Tracing Strategy');
    }
  }
};

const strategy = determineTracingStrategy();

// For snapshot testing. In tests, we provide a mock store wrapper if needed.
export const UnconnectedApp = () => (
  <MenuProvider>
    <Theme use='default'>
      <TracingStrategyProvider strategy={strategy}>
        <Entry />
      </TracingStrategyProvider>
    </Theme>
  </MenuProvider>
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
