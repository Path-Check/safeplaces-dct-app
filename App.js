import React, { useEffect, useReducer } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';

import { Theme } from './app/constants/themes';
import Entry from './app/Entry';
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
          <Entry />
        </Theme>
      </MenuProvider>
    </FlagsProvider>
    </context.Provider>
    
  );
};

export default App;
