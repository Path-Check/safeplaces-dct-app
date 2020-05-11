import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import BulletinsScreen from './BulletinsScreen';
import NewsScreen from './NewsScreen';
import RecomScreen from './RecomScreen';
import Details from '../../components/Details';

const Stack = createStackNavigator();
const TopBar = createMaterialTopTabNavigator();

const TopNavigation = ({ navigation }) => {
  navigation.setOptions({ headerShown: false });

  return (
    <TopBar.Navigator
      tabBarOptions={{
        activeTintColor: '#0059ff',
        inactiveTintColor: '#000',
        labelStyle: styles.label,
      }}
    >
      <TopBar.Screen name="Noticias" component={NewsScreen} />
      <TopBar.Screen name="Boletines" component={BulletinsScreen} />
      <TopBar.Screen name="Consejos" component={RecomScreen} />
    </TopBar.Navigator>
  );
};

export default function NewsMainScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NewsNavigation" component={TopNavigation} />
      <Stack.Screen name="Details" component={Details} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
  },
});
