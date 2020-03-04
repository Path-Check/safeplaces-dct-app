/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StatusBar
} from 'react-native';

import LocationTracking from './app/LocationTracking';

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <LocationTracking />
    </>
  );
};

export default App;
