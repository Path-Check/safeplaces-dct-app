import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';

import languages from '../../../locales/languages';
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
      <Tab.Screen
        name={languages.t('navigation.hospitals_maps')}
        component={Map}
      />
      <Tab.Screen
        name={languages.t('navigation.laboratories_maps')}
        component={Map}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
  },
});

export default index;
