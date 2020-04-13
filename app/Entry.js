import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React, { Component } from 'react';

import { PARTICIPATE } from './constants/storage';
import { GetStoreData } from './helpers/General';
import AboutScreen from './views/About';
import ChooseProviderScreen from './views/ChooseProvider';
import ExportScreen from './views/Export';
import { ExposureHistoryScreen } from './views/ExposureHistory/ExposureHistory';
import ImportScreen from './views/Import';
import LicencesScreen from './views/Licenses';
import LocationTracking from './views/LocationTracking';
import MapLocation from './views/MapLocation';
import NewsScreen from './views/News';
import Onboarding1 from './views/onboarding/Onboarding1';
import Onboarding2 from './views/onboarding/Onboarding2';
import Onboarding3 from './views/onboarding/Onboarding3';
import Onboarding4 from './views/onboarding/Onboarding4';
import Onboarding5 from './views/onboarding/Onboarding5';
import OverlapScreen from './views/Overlap';
import SettingsScreen from './views/Settings';

const Stack = createStackNavigator();

class Entry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRouteName: '',
    };
  }

  componentDidMount() {
    GetStoreData(PARTICIPATE)
      .then(isParticipating => {
        console.log(isParticipating);
        this.setState({
          initialRouteName: isParticipating,
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
          }}>
          {this.state.initialRouteName === 'true' ? (
            <Stack.Screen
              name='InitialScreen'
              component={LocationTracking}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name='InitialScreen'
              component={Onboarding1}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name='Onboarding1'
            component={Onboarding1}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Onboarding2'
            component={Onboarding2}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Onboarding3'
            component={Onboarding3}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Onboarding4'
            component={Onboarding4}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Onboarding5'
            component={Onboarding5}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='MapLocation'
            component={MapLocation}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='LocationTrackingScreen'
            component={LocationTracking}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='NewsScreen'
            component={NewsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='ExportScreen'
            component={ExportScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='ImportScreen'
            component={ImportScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='SettingsScreen'
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='ChooseProviderScreen'
            component={ChooseProviderScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='LicensesScreen'
            component={LicencesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='ExposureHistoryScreen'
            component={ExposureHistoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='OverlapScreen'
            component={OverlapScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='AboutScreen'
            component={AboutScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Entry;
