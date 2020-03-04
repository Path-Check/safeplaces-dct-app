import React, {Component } from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LocationTracking from './views/LocationTracking';
const Stack = createStackNavigator();

export class Entry extends Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen
              name="WelcomeScreen"
              component={Welcome}
              options={{headerShown:false}}
                />
            <Stack.Screen
              name="LocationTrackingScreen"
              component={LocationTracking}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )
    }
}