import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import PushNotification from 'react-native-push-notification';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { FIREBASE_SERVICE } from './constants/DR/baseUrls';
import { PARTICIPATE } from './constants/storage';
import fetch from './helpers/Fetch';
import { GetStoreData, SetStoreData } from './helpers/General';
import { HCAService } from './services/HCAService';
import LocationServices from './services/LocationService';
import { isPlatformiOS } from './Util';
import HomeScreen from './views/DR/HomeScreen';
import Maps from './views/DR/Maps';
import NewsMainScreen from './views/DR/News';
import ReportScreen from './views/DR/ReportScreen/';

const Tab = createBottomTabNavigator();

const BULLETINS_URL = `${FIREBASE_SERVICE}/bulletins`;

class MainNavigation extends React.Component {
  constructor(props) {
    super(props);
    try {
      this.checkCurrentState();
    } catch (e) {
      // statements
      console.log(e);
    }
  }

  async componentDidMount() {
    const { t } = this.props;
    try {
      const {
        data: { bulletins },
      } = await fetch(BULLETINS_URL);
      const lastBulletin = await GetStoreData('lastBulletin', true);

      if (bulletins[0].order != lastBulletin) {
        PushNotification.localNotification({
          title: t('label.new_bulletin_available_title'),
          message: t('label.new_bulletin_available_message'),
        });
        await SetStoreData('lastBulletin', bulletins[0].order);
      }
    } catch (e) {
      console.log('[ERROR]', e);
    }
  }

  checkCurrentState() {
    // NEED TO TEST ON ANDROID
    let locationPermission;
    if (isPlatformiOS()) {
      locationPermission = PERMISSIONS.IOS.LOCATION_ALWAYS;
    } else {
      locationPermission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    }

    // If user has location enabled & permissions, start logging
    GetStoreData(PARTICIPATE, false).then(isParticipating => {
      if (isParticipating && HCAService.isAutosubscriptionEnabled()) {
        check(locationPermission)
          .then(result => {
            switch (result) {
              case RESULTS.GRANTED:
                LocationServices.start();
                HCAService.findNewAuthorities();
                return;
              case RESULTS.UNAVAILABLE:
              case RESULTS.BLOCKED:
                console.log('NO LOCATION');
                LocationServices.stop();
            }
          })
          .catch(error => {
            console.log('error checking location: ' + error);
          });
      } else {
        LocationServices.stop();
      }
    });
  }

  render() {
    const {
      props: { t },
    } = this;

    return (
      <Tab.Navigator
        tabBarOptions={{
          style: [
            Platform.OS === 'ios'
              ? styles.bottomTabIOS
              : styles.bottomTabAndroid,
          ],
          tabStyle: [styles.bottomTabLabel],
        }}>
        <Tab.Screen
          name='Home'
          component={HomeScreen}
          options={{
            tabBarLabel: t('navigation.home'),
            // eslint-disable-next-line react/display-name
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
          name='ReportScreen'
          component={ReportScreen}
          options={{
            tabBarLabel: t('navigation.report'),
            // eslint-disable-next-line react/display-name
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
            tabBarLabel: t('navigation.maps'),
            // eslint-disable-next-line react/display-name
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
            tabBarLabel: t('navigation.news'),
            // eslint-disable-next-line react/display-name
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

export default withTranslation()(MainNavigation);
