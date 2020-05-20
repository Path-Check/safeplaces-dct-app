import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';

import Map from './Map';

const Tab = createMaterialTopTabNavigator();

const index = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#0059ff',
        inactiveTintColor: '#000',
        labelStyle: styles.label,
      }}
      swipeEnabled={false}>
      <Tab.Screen name='Hospitals' component={Map} />
      <Tab.Screen name='Laboratories' component={Map} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
  },
});

export default index;
