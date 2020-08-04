import React, { useCallback, useEffect, useState, useContext } from 'react';
import { AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import LocationServices from '../services/LocationService';
import NotificationService from '../services/NotificationService';
import { AllServicesOnScreen } from './main/AllServicesOn';
import {
  TracingOffScreen,
  NotificationsOffScreen,
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
  const selectedAuthorities = useSelector(
    selectedHealthcareAuthoritiesSelector,
  );
  const [canTrack, setCanTrack] = useState(true);

  const updateStateInfo = useCallback(async () => {
    const locationStatus = await LocationServices.checkStatusAndStartOrStop();
    setCanTrack(locationStatus.canTrack);
    notification.check();
    NotificationService.configure(notification.status);
  }, [setCanTrack, notification]);

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

  if (!canTrack) {
    return <TracingOffScreen />;
  } else if (notification.status === PermissionStatus.DENIED) {
    return <NotificationsOffScreen />;
  } else if (selectedAuthorities.length === 0) {
    // TODO: enable this for testing versions of app
    // return <SelectAuthorityScreen />;
    return <AllServicesOnScreen navigation={navigation} noHaAvailable />;
  } else {
    return <AllServicesOnScreen navigation={navigation} />;
  }
};
