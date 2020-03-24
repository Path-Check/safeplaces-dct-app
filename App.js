/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import Entry from './app/Entry';

const App: () => React$Node = () => {
  return (
    <MenuProvider>
      <Entry />
    </MenuProvider>
  );
};

export default App;
