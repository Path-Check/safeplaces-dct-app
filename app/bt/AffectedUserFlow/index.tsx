import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackCardStyleInterpolator,
} from '@react-navigation/stack';

import { AffectedUserProvider } from './AffectedUserContext';
import Start from './Start';
import CodeInput from './CodeInput';
import Complete from './Complete';
import PublishConsent from './PublishConsent';

import { Screens } from '../../navigation';

const Stack = createStackNavigator();

const fade: StackCardStyleInterpolator = ({ current }) => ({
  cardStyle: { opacity: current.progress },
});

const SCREEN_OPTIONS = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  cardStyle: {
    backgroundColor: 'transparent', // prevent white flash on Android
  },
  headerShown: false,
};

const ExportStack = (): JSX.Element => (
  <AffectedUserProvider>
    <Stack.Navigator
      mode='modal'
      screenOptions={{
        ...SCREEN_OPTIONS,
        cardStyleInterpolator: fade,
        gestureEnabled: false,
      }}
      initialRouteName={Screens.ExportIntro}>
      <Stack.Screen name={Screens.AffectedUserStart} component={Start} />
      <Stack.Screen
        name={Screens.AffectedUserCodeInput}
        component={CodeInput}
      />
      <Stack.Screen
        name={Screens.AffectedUserPublishConsent}
        component={PublishConsent}
      />
      <Stack.Screen
        name={Screens.AffectedUserExportDone}
        component={CodeInput}
      />
      <Stack.Screen name={Screens.AffectedUserComplete} component={Complete} />
    </Stack.Navigator>
  </AffectedUserProvider>
);

export default ExportStack;
