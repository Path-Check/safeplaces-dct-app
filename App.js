import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'text-encoding-polyfill';
import 'array-flat-polyfill';

import { Entry } from './app/Entry';
import { TracingStrategyProvider } from './app/TracingStrategyContext';
import VersionCheckService from './app/services/VersionCheckService';
import { store, persistor } from './app/store';
import gpsStrategy from './app/gps';
import BackgroundTaskService from './app/services/BackgroundTaskService';

// For snapshot testing. In tests, we provide a mock store wrapper if needed.
export const UnconnectedApp = () => (
  <TracingStrategyProvider strategy={gpsStrategy}>
    <Entry />
  </TracingStrategyProvider>
);

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    VersionCheckService.start();
    BackgroundTaskService.start();
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
