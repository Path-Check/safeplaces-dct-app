import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ExportCodeInput from './Export/ExportCodeInput';
import ExportComplete from './Export/ExportComplete';
import ExportConfirmUpload from './Export/ExportConfirmUpload';
import ExportIntro from './Export/ExportIntro';
import ExportLocationConsent from './Export/ExportLocationConsent';
import ExportPublishConsent from './Export/ExportPublishConsent';
import ExportSelectHA from './Export/ExportSelectHA';

import { Screens } from '../navigation';

const Stack = createStackNavigator();

const ExportStack = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
    }}
    initialRouteName={Screens.ExportSelectHA}>
    <Stack.Screen name={Screens.ExportIntro} component={ExportIntro} />
    <Stack.Screen name={Screens.ExportSelectHA} component={ExportSelectHA} />
    <Stack.Screen name={Screens.ExportCodeInput} component={ExportCodeInput} />
    <Stack.Screen
      name={Screens.ExportLocationConsent}
      component={ExportLocationConsent}
    />
    <Stack.Screen
      name={Screens.ExportPublishConsent}
      component={ExportPublishConsent}
    />
    <Stack.Screen
      name={Screens.ExportConfirmUpload}
      component={ExportConfirmUpload}
    />
    <Stack.Screen name={Screens.ExportDone} component={ExportCodeInput} />
    <Stack.Screen name={Screens.ExportComplete} component={ExportComplete} />
  </Stack.Navigator>
);

export default ExportStack;
