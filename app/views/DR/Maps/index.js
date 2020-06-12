import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';

import Map from './Map';

const Tab = createMaterialTopTabNavigator();

const Index = () => {
  const { t } = useTranslation();
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
            tabBarLabel: t('navigation.hospitals_maps'),
          }}
          component={Map}
        />
        <Tab.Screen
          name='Laboratories'
          options={{
            tabBarLabel: t('navigation.laboratories_maps'),
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

export default Index;
