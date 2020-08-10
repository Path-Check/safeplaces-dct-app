import React, { useCallback, useEffect, useState, useContext } from 'react';
import { AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import LocationServices from '../services/LocationService';
import NotificationService from '../services/NotificationService';
import { AllServicesOnScreen } from './main/AllServicesOn';
import {
  TracingOffScreen,
  NotificationsOffScreen,
  SelectAuthorityScreen,
} from './main/ServiceOffScreens';
import PermissionsContext from '../gps/PermissionsContext';
import { PermissionStatus } from '../permissionStatus';

import { useSelector, useDispatch } from 'react-redux';
import selectedHealthcareAuthoritiesSelector from '../store/selectors/selectedHealthcareAuthoritiesSelector';
import { useStatusBarEffect } from '../navigation';
import getHealthcareAuthoritiesAction from '../store/actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import Geolocation from '@react-native-community/geolocation';

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

  const dispatch = useDispatch();
  const { autoSubscription } = useSelector(
    (state) => state.healthcareAuthorities,
  );

  const autoSubscribe = useCallback(async () => {
    if (autoSubscription.active) {
      Geolocation.getCurrentPosition(({ coords }) => {
        dispatch(
          getHealthcareAuthoritiesAction({ autoSubscriptionLocation: coords }),
        );
      });
    }
  }, [autoSubscription, dispatch]);

  useEffect(() => {
    autoSubscribe();
  }, [autoSubscribe]);

  if (!canTrack) {
    return <TracingOffScreen />;
  } else if (notification.status === PermissionStatus.DENIED) {
    return <NotificationsOffScreen />;
  } else if (selectedAuthorities.length === 0) {
    if (autoSubscription.active) {
      return <AllServicesOnScreen navigation={navigation} />;
    } else {
      return <SelectAuthorityScreen />;
    }
  } else {
    return <AllServicesOnScreen navigation={navigation} />;
  }
};
