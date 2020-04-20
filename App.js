/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';

import { Theme } from './app/constants/themes';
import Entry from './app/Entry';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <MenuProvider>
      <Theme use='default'>
        <Entry />
      </Theme>
    </MenuProvider>
  );
};

export default App;
