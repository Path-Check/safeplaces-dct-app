import React, {Component } from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LocationTracking from './views/LocationTracking';
import Welcome from './views/Welcome';

const Stack = createStackNavigator();

class Entry extends Component {
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

export default Entry;