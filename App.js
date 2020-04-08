/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { MenuProvider } from 'react-native-popup-menu';
import Entry from './app/Entry';

// eslint-disable-next-line no-undef
const App: () => React$Node = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <MenuProvider>
      <Entry />
    </MenuProvider>
  );
};

export default App;
