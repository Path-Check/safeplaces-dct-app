import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useReducer } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';

import context from './app/components/DR/Reduces/context';
import { initialState, reducer } from './app/components/DR/Reduces/index';
import { Theme } from './app/constants/themes';
import Entry from './app/Entry';
import { FlagsProvider } from './app/helpers/Flags';
// import NavEntry from './app/NavEntry';
import VersionCheckService from './app/services/VersionCheckService';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    VersionCheckService.start();
  }, []);

  const [state, setState] = useReducer(reducer, initialState);

  return (
    <context.Provider value={[state, setState]}>
      <FlagsProvider>
        <MenuProvider>
          <Theme use='default'>
            <NavigationContainer>
              <Entry />
            </NavigationContainer>
          </Theme>
        </MenuProvider>
      </FlagsProvider>
    </context.Provider>
  );
};

export default App;
