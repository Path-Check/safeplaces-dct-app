import React, {Component } from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native';
import Authentication from './views/Authentication';
import LocationTracking from './views/LocationTracking';
import Welcome from './views/Welcome';
import NewsScreen from './views/News';
import ExportScreen from './views/Export';
import ImportScreen from './views/Import';
import Slider from './views/welcomeScreens/Slider';
import {GetStoreData, SetStoreData} from './helpers/General';

const Stack = createStackNavigator();

class Entry extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
    }

    render() {
      return (
        <NavigationContainer>
          <SafeAreaView style={{flex:1}}>
          <Stack.Navigator initialRouteName='AuthenticationScreen'>
            <Stack.Screen
              name="Slider"
              component={Slider}
              options={{headerShown:false}}
            />
            <Stack.Screen
              name="AuthenticationScreen"
              component={Authentication}
              options={{headerShown:false}}
            />
            <Stack.Screen
              name="WelcomeScreen"
              component={Welcome}
              options={{headerShown:false}}
            />
            <Stack.Screen
              name="LocationTrackingScreen"
              component={LocationTracking}
              options={{headerShown:false}}
            />
            <Stack.Screen
              name="NewsScreen"
              component={NewsScreen}
              options={{headerShown:false}}
            />
            <Stack.Screen
              name="ExportScreen"
              component={ExportScreen}
              options={{headerShown:false}}
            />
            <Stack.Screen
              name="ImportScreen"
              component={ImportScreen}
              options={{headerShown:false}}
            />
          </Stack.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      )
    }
}

export default Entry;
