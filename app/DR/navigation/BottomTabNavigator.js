import React, { useEffect, useState } from 'react';
import { StyleSheet, Keyboard, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen/ReportScreen';
import MapScreen from '../screens/MapScreen';
import NewsMainScreen from '../screens/NewsScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Inicio';

export default function BottomTabNavigator({ navigation }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  navigation.setOptions({
    headerShown: false,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnable: false,
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setTimeout(() => {
          setKeyboardVisible(false); // or some other action
        }, 200);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <BottomTab.Navigator
      tabBarOptions={{
        style: [
          Platform.OS === 'ios' ? styles.bottomTabIOS : styles.bottomTabAndroid,
          isKeyboardVisible ? { display: 'none' } : null,
        ],
        tabStyle: [styles.bottomTabLabel],
      }}
      initialRouteName={INITIAL_ROUTE_NAME}
    >
      <BottomTab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-home" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Reportar"
        component={ReportScreen}
        options={{
          title: 'Reportar',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-add-circle" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Mapa"
        component={MapScreen}
        options={{
          title: 'Mapa',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-pin" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Noticias"
        component={NewsMainScreen}
        options={{
          title: 'Noticias',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-paper" />
          ),
        }}
      />
    </BottomTab.Navigator>
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
