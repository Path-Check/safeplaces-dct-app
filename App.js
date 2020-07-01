import React, { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Config from 'react-native-config';
import 'array-flat-polyfill';

import { Entry } from './app/Entry';
import { TracingStrategyProvider } from './app/TracingStrategyContext';
import VersionCheckService from './app/services/VersionCheckService';
import { store, persistor } from './app/store';
import btStrategy from './app/bt';
import gpsStrategy from './app/gps';
import BackgroundTaskService from './app/services/BackgroundTaskService';
import { isGPS } from './app/COVIDSafePathsConfig';

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn:
    'https://a087b70421574d8d9d66234f52c3ca4b@o418441.ingest.sentry.io/5321381',
});

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
    <TracingStrategyProvider strategy={strategy}>
      <Entry />
    </TracingStrategyProvider>
  </MenuProvider>
);

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    VersionCheckService.start();
    isGPS && BackgroundTaskService.start();
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
