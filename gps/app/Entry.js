import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React, { Component } from 'react';

import { GetStoreData } from './helpers/General';
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
import { MainNavigate } from './views/Main';
import NewsScreen from './views/News';
import Onboarding1 from './views/onboarding/Onboarding1';
import Onboarding2 from './views/onboarding/Onboarding2';
import Onboarding3 from './views/onboarding/Onboarding3';
import Onboarding5 from './views/onboarding/Onboarding5';
import { SettingsScreen } from './views/Settings';

const Stack = createStackNavigator();

class Entry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onboardingComplete: null,
    };
  }

  componentDidMount() {
    GetStoreData('ONBOARDING_DONE')
      .then(onboardingComplete => {
        this.setState({
          onboardingComplete: onboardingComplete !== 'true',
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='InitialScreen'
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            cardStyle: {
              backgroundColor: 'transparent', // prevent white flash on Android
            },
            headerShown: false,
          }}>
          {this.state.onboardingComplete ? (
            <Stack.Screen name='InitialScreen' component={MainNavigate} />
          ) : (
            <Stack.Screen name='InitialScreen' component={Onboarding1} />
          )}
          <Stack.Screen name='Onboarding1' component={Onboarding1} />
          <Stack.Screen name='Onboarding2' component={Onboarding2} />
          <Stack.Screen name='Onboarding3' component={Onboarding3} />
          <Stack.Screen name='Onboarding5' component={Onboarding5} />
          <Stack.Screen name='Main' component={MainNavigate} />
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
      </NavigationContainer>
    );
  }
}

export default Entry;
