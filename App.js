import React, { useEffect, useReducer } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';

import { Theme } from './app/constants/themes';
import NavEntry from './app/NavEntry';
import { FlagsProvider } from './app/helpers/Flags';
import VersionCheckService from './app/services/VersionCheckService';
import { reducer, initialState } from './app/components/DR/Reduces/index';
import context from './app/components/DR/Reduces/context';

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
            <NavEntry />
          </NavigationContainer>
        </Theme>
      </MenuProvider>
    </FlagsProvider>
    </context.Provider>
    
  );
};

export default App;
