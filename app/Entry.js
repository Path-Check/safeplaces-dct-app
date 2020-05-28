import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';

import AboutScreen from './views/About';
import ChooseProviderScreen from './views/ChooseProvider';
import { ExportScreen } from './views/Export';
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
import Onboarding5 from './views/onboarding/Onboarding5';
import { SettingsScreen } from './views/Settings';

const Stack = createStackNavigator();

const screenOptions = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  cardStyle: {
    backgroundColor: 'transparent', // prevent white flash on Android
  },
  headerShown: false,
};

const MainApp = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name='Main' component={Main} />
    <Stack.Screen name='NewsScreen' component={NewsScreen} />
    <Stack.Screen name='ExportScreen' component={ExportScreen} />
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
);

const OnboardingStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name='Onboarding1' component={Onboarding1} />
    <Stack.Screen name='Onboarding2' component={Onboarding2} />
    <Stack.Screen name='Onboarding3' component={Onboarding3} />
    <Stack.Screen name='Onboarding4' component={Onboarding4} />
    <Stack.Screen name='Onboarding5' component={Onboarding5} />
  </Stack.Navigator>
);

export const Entry = () => {
  const onboardingComplete = useSelector(state => state.onboarding.complete);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {onboardingComplete ? (
          <Stack.Screen name={'App'} component={MainApp} />
        ) : (
          <Stack.Screen name={'Onboarding'} component={OnboardingStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
