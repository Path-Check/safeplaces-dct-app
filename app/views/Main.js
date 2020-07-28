import React, { useCallback, useEffect, useState, useContext } from 'react';
import { AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

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

import { useSelector, useDispatch } from 'react-redux';
import selectedHealthcareAuthoritiesSelector from '../store/selectors/selectedHealthcareAuthoritiesSelector';
import isAutoSubscriptionEnabledSelector from '../store/selectors/isAutoSubscriptionEnabledSelector';
import getHealthcareAuthorities from '../store/actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import { useStatusBarEffect } from '../navigation';

export const Main = () => {
  useStatusBarEffect('light-content');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { notification, location } = useContext(PermissionsContext);
  const selectedAuthorities = useSelector(
    selectedHealthcareAuthoritiesSelector,
  );
  const autoSubscriptionEnabled = useSelector(
    isAutoSubscriptionEnabledSelector,
  );
  const [canTrack, setCanTrack] = useState(true);

  const updateStateInfo = useCallback(async () => {
    const locationStatus = await LocationServices.checkStatusAndStartOrStop();
    setCanTrack(locationStatus.canTrack);
    notification.check();
    NotificationService.configure(notification.status);
  }, [setCanTrack, notification]);

  const autoSubscribe = useCallback(async () => {
    console.log('AUTO_SUBSCRIBE_METHOD_START');
    if (
      autoSubscriptionEnabled &&
      selectedAuthorities.length === 0 &&
      location.status === PermissionStatus.GRANTED
    ) {
      Geolocation.getCurrentPosition(({ coords }) => {
        dispatch(getHealthcareAuthorities(undefined, coords));
      });
    }
  }, [
    autoSubscriptionEnabled,
    selectedAuthorities.length,
    location.status,
    dispatch,
  ]);

  useEffect(() => {
    updateStateInfo();
    autoSubscribe();
    // refresh state if user backgrounds app
    AppState.addEventListener('change', updateStateInfo);

    // refresh state if settings change
    const unsubscribe = navigation.addListener('focus', updateStateInfo);

    return () => {
      AppState.removeEventListener('change', updateStateInfo);
      unsubscribe();
    };
  }, [navigation, updateStateInfo, autoSubscribe]);

  if (!canTrack) {
    return <TracingOffScreen />;
  } else if (notification.status === PermissionStatus.DENIED) {
    return <NotificationsOffScreen />;
  } else if (selectedAuthorities.length === 0) {
    // TODO: enable this for testing versions of app
    // return <SelectAuthorityScreen />;
    return <AllServicesOnScreen noHaAvailable />;
  } else {
    return <AllServicesOnScreen />;
  }
};
