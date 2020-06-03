import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import Colors from '../../../constants/colors';
import AdviceScreen from './Advices';
import BulletinsScreen from './Bulletins';
import Details from './Details';
import NewsScreen from './News';

const TopBar = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function TabNavigation() {
  const { t } = useTranslation();
  return (
    <>
      <StatusBar backgroundColor={Colors.BLUE_RIBBON} />
      <SafeAreaView style={styles.safeArea}>
        <TopBar.Navigator
          tabBarOptions={{
            activeTintColor: '#0059ff',
            inactiveTintColor: '#000',
            labelStyle: styles.label,
          }}>
          <TopBar.Screen name={t('navigation.news')} component={NewsScreen} />
          <TopBar.Screen
            name={t('navigation.bulletins')}
            component={BulletinsScreen}
          />
          <TopBar.Screen
            name={t('navigation.advices')}
            component={AdviceScreen}
          />
        </TopBar.Navigator>
      </SafeAreaView>
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
  safeArea: {
    flex: 1,
  },
});
