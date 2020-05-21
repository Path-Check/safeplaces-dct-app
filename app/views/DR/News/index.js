import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';

import Colors from '../../../constants/colors';
import AdviceScreen from './Advices';
import BulletinsScreen from './Bulletins';
import Details from './Details';
import NewsScreen from './News';

const TopBar = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function TabNavigation() {
  return (
    <>
      <StatusBar backgroundColor={Colors.BLUE_RIBBON} />
      <TopBar.Navigator
        tabBarOptions={{
          activeTintColor: '#0059ff',
          inactiveTintColor: '#000',
          labelStyle: styles.label,
        }}>
        <TopBar.Screen name='Noticias' component={NewsScreen} />
        <TopBar.Screen name='Boletines' component={BulletinsScreen} />
        <TopBar.Screen name='Consejos' component={AdviceScreen} />
      </TopBar.Navigator>
    </>
  );
}

export default function NewsMainScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='TabNavigation'
        component={TabNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Details'
        component={Details}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
  },
});
