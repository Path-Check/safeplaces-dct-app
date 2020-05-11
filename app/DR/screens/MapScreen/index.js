import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';
import MapScreen from './MapScreen';

const TopBar = createMaterialTopTabNavigator();

export default function MapMainScreen() {
  return (
    <TopBar.Navigator
      tabBarOptions={{
        activeTintColor: '#0059ff',
        inactiveTintColor: '#000',
        labelStyle: styles.label,
      }}
      swipeEnabled={false}
    >
      <TopBar.Screen name="Hospitales" component={MapScreen} />
      <TopBar.Screen name="Laboratorios" component={MapScreen} />
    </TopBar.Navigator>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
  },
});
