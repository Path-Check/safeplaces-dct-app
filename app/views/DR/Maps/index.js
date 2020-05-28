import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import languages from '../../../locales/languages';
import Map from './Map';

const Tab = createMaterialTopTabNavigator();

const index = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#0059ff',
          inactiveTintColor: '#000',
          labelStyle: styles.label,
        }}
        swipeEnabled={false}>
        <Tab.Screen
          name='Hospitals'
          options={{
            tabBarLabel: languages.t('navigation.hospitals_maps'),
          }}
          component={Map}
        />
        <Tab.Screen
          name='Laboratories'
          options={{
            tabBarLabel: languages.t('navigation.laboratories_maps'),
          }}
          component={Map}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
  },
  safeArea: {
    flex: 1,
  },
});

export default index;
