import 'react-native-gesture-handler';

import React, { useEffect, useReducer } from 'react';
import { StatusBar } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';

import context from './app/components/DR/Reduces/context';
import { initialState, reducer } from './app/components/DR/Reduces/index';
import Colors from './app/constants/colors';
import { Theme } from './app/constants/themes';
import Entry from './app/Entry';
import { FlagsProvider } from './app/helpers/Flags';
import VersionCheckService from './app/services/VersionCheckService';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    VersionCheckService.start();
  }, []);

  const [state, setState] = useReducer(reducer, initialState);

  return (
    <context.Provider value={[state, setState]}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={Colors.BLUE_RIBBON}
      />
      <FlagsProvider>
        <MenuProvider>
          <Theme use='default'>
            <Entry />
          </Theme>
        </MenuProvider>
      </FlagsProvider>
    </context.Provider>
  );
};

export default App;
