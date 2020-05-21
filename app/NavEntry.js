import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './views/DR/HomeScreen';
import Maps from './views/DR/Maps';
import NewsMainScreen from './views/DR/News';
import ReportScreen from './views/DR/ReportScreen';
import LocationTracking from './views/LocationTracking';

const Tab = createBottomTabNavigator();

function MainNavigation() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: [
          Platform.OS === 'ios' ? styles.bottomTabIOS : styles.bottomTabAndroid,
        ],
        tabStyle: [styles.bottomTabLabel],
      }}>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              focused={focused}
              name='ios-home'
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Location'
        component={LocationTracking}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              focused={focused}
              name='ios-radio'
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Report'
        component={ReportScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              focused={focused}
              name='ios-add-circle'
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Maps'
        component={Maps}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              focused={focused}
              name='ios-pin'
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name='News'
        component={NewsMainScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              focused={focused}
              name='md-paper'
              size={25}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bottomTabIOS: {
    height: hp('13%'),
    minHeight: 70,
    maxHeight: 110,
  },
  bottomTabLabel: {
    padding: 15,
  },
  bottomTabAndroid: {
    minHeight: 70,
  },
});

export default MainNavigation;
