import React, { useCallback, useEffect, useState, useContext } from 'react';
import { AppState, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import LocationServices, { DEVICE_LOCATION_OFF, APP_NOT_AUTHORIZED } from '../services/LocationService';
import NotificationService from '../services/NotificationService';
import { AllServicesOnScreen } from './main/AllServicesOn';
import {
  TracingOffScreen,
  NotificationsOffScreen,
  LocationDisabledScreen,
  // SelectAuthorityScreen,
} from './main/ServiceOffScreens';
import PermissionsContext from '../gps/PermissionsContext';
import { PermissionStatus } from '../permissionStatus';

import { useSelector } from 'react-redux';
import selectedHealthcareAuthoritiesSelector from '../store/selectors/selectedHealthcareAuthoritiesSelector';
import { useStatusBarEffect } from '../navigation';

export const Main = () => {
  useStatusBarEffect('light-content');
  const navigation = useNavigation();
  const { notification } = useContext(PermissionsContext);
  const hasSelectedAuthorities =
    useSelector(selectedHealthcareAuthoritiesSelector).length > 0;
  const [locationServiceStatus, setLocationServiceStatus] = useState('DEVICE_LOCATION_OFF');
  const isiOS = Platform.OS === 'ios';


  const updateStateInfo = useCallback(async () => {
    const locationStatus = await LocationServices.checkStatusAndStartOrStop();
    setLocationServiceStatus(locationStatus.reason);
    notification.check();
    NotificationService.configure(notification.status);
  }, [setLocationServiceStatus, notification]);

  useEffect(() => {
    updateStateInfo();
    // refresh state if user backgrounds app
    AppState.addEventListener('change', updateStateInfo);
    if (!isiOS) {
      AppState.addEventListener('focus', updateStateInfo);
    }
    // refresh state if settings change
    const unsubscribe = navigation.addListener('focus', updateStateInfo);

    return () => {
      AppState.removeEventListener('change', updateStateInfo);
      if (!isiOS) {
        AppState.removeEventListener('focus', updateStateInfo);
      }
      unsubscribe();
    };
  }, [navigation, updateStateInfo]);

  if (locationServiceStatus === DEVICE_LOCATION_OFF) {
    return <LocationDisabledScreen />;
  } else if (locationServiceStatus === APP_NOT_AUTHORIZED) {
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
