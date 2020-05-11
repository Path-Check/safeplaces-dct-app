import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReportScreen from './ReportScreen';
import OutOfCountry from './OutOfCountry/OutOfCountry';
import DontFeelGood from './DontFeelGood';
import CloseInfected from './CloseInfected';

const Stack = createStackNavigator();
export default function stackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen name="ReportScreen" component={ReportScreen} />
      <Stack.Screen name="OutOfCountry" component={OutOfCountry} />
      <Stack.Screen name="DontFeelGood" component={DontFeelGood} />
      <Stack.Screen name="CloseInfected" component={CloseInfected} />
    </Stack.Navigator>
  );
}
