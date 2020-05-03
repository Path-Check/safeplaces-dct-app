import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import colors from './constants/colors';
import { GetStoreData } from './helpers/General';
import { ABOUT_SCREEN_NAME, AboutScreen } from './views/About';
import {
  CHOOSE_PROVIDER_SCREEN_NAME,
  ChooseProviderScreen,
} from './views/ChooseProvider';
import { EXPORT_SCREEN_NAME, ExportScreen } from './views/Export';
import {
  EXPOSURE_HISTORY_SCREEN_NAME,
  ExposureHistoryScreen,
} from './views/ExposureHistory/ExposureHistory';
import { IMPORT_SCREEN_NAME, ImportScreen } from './views/Import';
import { LICENSES_SCREEN_NAME, LicensesScreen } from './views/Licenses';
import {
  LOCATION_TRACKING_SCREEN_NAME,
  LocationTracking,
} from './views/LocationTracking';
import { NEWS_SCREEN_NAME, NewsScreen } from './views/News';
import {
  ONBOARDING1_SCREEN_NAME,
  Onboarding1,
} from './views/onboarding/Onboarding1';
import {
  ONBOARDING2_SCREEN_NAME,
  Onboarding2,
} from './views/onboarding/Onboarding2';
import {
  ONBOARDING3_SCREEN_NAME,
  Onboarding3,
} from './views/onboarding/Onboarding3';
import {
  ONBOARDING4_SCREEN_NAME,
  Onboarding4,
} from './views/onboarding/Onboarding4';
import {
  ONBOARDING5_SCREEN_NAME,
  Onboarding5,
} from './views/onboarding/Onboarding5';
import { SETTINGS_SCREEN_NAME, SettingsScreen } from './views/Settings';

const Stack = createStackNavigator();

export const INITIAL_SCREEN_NAME = 'InitalScreen';

class Entry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnboardingComplete: false,
    };
  }

  async componentDidMount() {
    await this.getOnboardingStatus();
  }

  async getOnboardingStatus() {
    const isOnboardingComplete = await GetStoreData(
      'ONBOARDING_DONE',
      false,
    ).catch(error => console.log(error));

    this.setState({
      isOnboardingComplete,
    });
  }

  getInitalComponent() {
    return this.state.isOnboardingComplete ? LocationTracking : Onboarding1;
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={INITIAL_SCREEN_NAME}
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            cardStyle: styles.cardStyle,
          }}>
          <Stack.Screen
            name={INITIAL_SCREEN_NAME}
            component={this.getInitalComponent()}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={ONBOARDING1_SCREEN_NAME}
            component={Onboarding1}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={ONBOARDING2_SCREEN_NAME}
            component={Onboarding2}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={ONBOARDING3_SCREEN_NAME}
            component={Onboarding3}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={ONBOARDING4_SCREEN_NAME}
            component={Onboarding4}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={ONBOARDING5_SCREEN_NAME}
            component={Onboarding5}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={LOCATION_TRACKING_SCREEN_NAME}
            component={LocationTracking}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NEWS_SCREEN_NAME}
            component={NewsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={EXPORT_SCREEN_NAME}
            component={ExportScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={IMPORT_SCREEN_NAME}
            component={ImportScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SETTINGS_SCREEN_NAME}
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={CHOOSE_PROVIDER_SCREEN_NAME}
            component={ChooseProviderScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={LICENSES_SCREEN_NAME}
            component={LicensesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={EXPOSURE_HISTORY_SCREEN_NAME}
            component={ExposureHistoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={ABOUT_SCREEN_NAME}
            component={AboutScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    backgroundColor: colors.TRANSPARENT, // prevent white flash on Android
  },
});

export default Entry;
