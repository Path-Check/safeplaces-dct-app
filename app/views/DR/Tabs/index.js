import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';

import NewsScreen from './NewsScreen';

const TopBar = createMaterialTopTabNavigator();

export default function NewsMainScreen() {
  return (
    <TopBar.Navigator
      tabBarOptions={{
        activeTintColor: '#0059ff',
        inactiveTintColor: '#000',
        labelStyle: styles.label,
      }}>
      <TopBar.Screen name='Noticias' component={NewsScreen} />
      {/*<TopBar.Screen name="Boletines" component={BulletinsScreen} />*/}
      {/*<TopBar.Screen name="Consejos" component={RecomScreen} />*/}
    </TopBar.Navigator>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
  },
});
