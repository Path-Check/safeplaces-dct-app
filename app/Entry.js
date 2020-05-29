import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  TransitionPresets,
  createStackNavigator,
} from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';

import { ONBOARDING_DONE } from './constants/storage';
import { GetStoreData } from './helpers/General';
import AboutScreen from './views/About';
import ChooseProviderScreen from './views/ChooseProvider';
import ExportCodeInput from './views/Export/ExportCodeInput';
import ExportSelectHA from './views/Export/ExportSelectHA';
import ExportStart from './views/Export/ExportStart';
import { ExposureHistoryScreen } from './views/ExposureHistory/ExposureHistory';
import {
  FEATURE_FLAG_SCREEN_NAME,
  FeatureFlagsScreen,
} from './views/FeatureFlagToggles';
import ImportScreen from './views/Import';
import { LicensesScreen } from './views/Licenses';
import { Main } from './views/Main';
import NewsScreen from './views/News';
import Onboarding1 from './views/onboarding/Onboarding1';
import Onboarding2 from './views/onboarding/Onboarding2';
import Onboarding3 from './views/onboarding/Onboarding3';
import Onboarding4 from './views/onboarding/Onboarding4';
import { OnboardingPermissions } from './views/onboarding/OnboardingPermissions';
import { SettingsScreen } from './views/Settings';

const Stack = createStackNavigator();

const fade = ({ current }) => ({ cardStyle: { opacity: current.progress } });

const screenOptions = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  cardStyle: {
    backgroundColor: 'transparent', // prevent white flash on Android
  },
  headerShown: false,
};

const ExportStack = () => (
  <Stack.Navigator mode='modal' screenOptions={screenOptions}>
    <Stack.Screen
      options={{ cardStyleInterpolator: fade }}
      name='ExportStart'
      component={ExportStart}
    />
    <Stack.Screen
      options={{ cardStyleInterpolator: fade }}
      name='ExportSelectHA'
      component={ExportSelectHA}
    />
    <Stack.Screen
      options={{ cardStyleInterpolator: fade }}
      name='ExportCodeInput'
      component={ExportCodeInput}
    />
  </Stack.Navigator>
);

export const Entry = () => {
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    async function checkDone() {
      /** @type {boolean | undefined | null} */
      const flag = await GetStoreData(ONBOARDING_DONE, false /* isString */);
      setOnboardingDone(!!flag);
    }

    checkDone();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='InitialScreen'
        screenOptions={screenOptions}>
        <Stack.Screen
          name='InitialScreen'
          component={onboardingDone ? Main : Onboarding1}
        />
        <Stack.Screen name='Onboarding1' component={Onboarding1} />
        <Stack.Screen name='Onboarding2' component={Onboarding2} />
        <Stack.Screen name='Onboarding3' component={Onboarding3} />
        <Stack.Screen name='Onboarding4' component={Onboarding4} />
        <Stack.Screen
          name='OnboardingPermissions'
          component={OnboardingPermissions}
        />
        <Stack.Screen name='Main' component={Main} />
        <Stack.Screen name='NewsScreen' component={NewsScreen} />
        <Stack.Screen
          name='ExportScreen'
          component={ExportStack}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        <Stack.Screen name='ImportScreen' component={ImportScreen} />
        <Stack.Screen name='SettingsScreen' component={SettingsScreen} />
        <Stack.Screen
          name='ChooseProviderScreen'
          component={ChooseProviderScreen}
        />
        <Stack.Screen name='LicensesScreen' component={LicensesScreen} />
        <Stack.Screen
          name='ExposureHistoryScreen'
          component={ExposureHistoryScreen}
        />
        <Stack.Screen name='AboutScreen' component={AboutScreen} />
        <Stack.Screen
          name={FEATURE_FLAG_SCREEN_NAME}
          component={FeatureFlagsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
