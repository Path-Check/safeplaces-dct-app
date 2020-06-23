import React, { useCallback, useEffect, useState, useContext } from 'react';
import { AppState, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

import { checkIntersect } from '../helpers/Intersect';
import BackgroundTaskServices from '../services/BackgroundTaskService';
import LocationServices from '../services/LocationService';
import { AllServicesOnScreen } from './main/AllServicesOn';
import {
  TracingOffScreen,
  NotificationsOffScreen,
  // SelectAuthorityScreen,
} from './main/ServiceOffScreens';
import PermissionsContext, {
  PermissionStatus,
} from '../gps/PermissionsContext';

import { useSelector } from 'react-redux';
import selectedHealthcareAuthoritiesSelector from '../store/selectors/selectedHealthcareAuthoritiesSelector';
import { useStatusBarEffect } from '../navigation';

export const Main = () => {
  useStatusBarEffect('light-content');
  const navigation = useNavigation();
  const { notification } = useContext(PermissionsContext);
  const hasSelectedAuthorities =
    useSelector(selectedHealthcareAuthoritiesSelector).length > 0;
  const [trackingInfo, setTrackingInfo] = useState({ canTrack: true });

  const checkForPossibleExposure = () => {
    BackgroundTaskServices.start();
    checkIntersect();
  };

  const updateStateInfo = useCallback(async () => {
    checkForPossibleExposure();
    const { canTrack } = await LocationServices.checkStatusAndStartOrStop();
    setTrackingInfo({ canTrack });
  }, [setTrackingInfo]);

  useEffect(() => {
    updateStateInfo();
    // refresh state if user backgrounds app
    AppState.addEventListener('change', updateStateInfo);

    // refresh state if settings change
    const unsubscribe = navigation.addListener('focus', updateStateInfo);

    return () => {
      AppState.removeEventListener('change', updateStateInfo);
      unsubscribe();
    };
  }, [navigation, updateStateInfo]);

  useEffect(() => {
    if (notification.status === PermissionStatus.GRANTED) {
      PushNotification.configure({
        // (required) Called when a remote or local notification is opened or received
        onNotification(notification) {
          console.log('NOTIFICATION:', notification);
          // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
        // Setting the permissions to true causes a crash on Android, because that configuration requires Firebase
        // https://github.com/zo0r/react-native-push-notification#usage
        requestPermissions: Platform.OS === 'ios',
      });
    }
  }, [notification.status]);

  if (!trackingInfo.canTrack) {
    return <TracingOffScreen />;
  } else if (notification.status === PermissionStatus.DENIED) {
    return <NotificationsOffScreen />;
  } else if (hasSelectedAuthorities === false) {
    // TODO: enable this for testing versions of app
    // return <SelectAuthorityScreen />;
    return <AllServicesOnScreen noHaAvailable />;
  } else {
    return <AllServicesOnScreen />;
  }
};
