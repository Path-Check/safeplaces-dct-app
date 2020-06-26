import React, { useCallback, useState, useContext, useRef } from 'react';
import { AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import BackgroundTaskServices from '../services/BackgroundTaskService';
import LocationServices from '../services/LocationService';
import NotificationService from '../services/NotificationService';
import IntersectService from '../services/IntersectService';
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
import { useDeepCompareEffect } from '../helpers/CustomHooks';
import { debounce } from 'lodash';

export const Main = () => {
  useStatusBarEffect('light-content');
  const navigation = useNavigation();
  const { notification } = useContext(PermissionsContext);
  const hasSelectedAuthorities =
    useSelector(selectedHealthcareAuthoritiesSelector).length > 0;

  const debounceUpdateStateInfo = useRef(
    debounce(() => updateStateInfo(), 1000),
  ).current;

  const selectedAuthorities = useSelector(
    selectedHealthcareAuthoritiesSelector,
  );

  const [canTrack, setCanTrack] = useState(true);

  const checkForPossibleExposure = () => {
    BackgroundTaskServices.start();
    const intersectionStatus = IntersectService.instance.checkIntersect(true);
    console.log(`[intersection] ${intersectionStatus}`);
  };

  const updateStateInfo = useCallback(async () => {
    checkForPossibleExposure();
    const locationStatus = await LocationServices.checkStatusAndStartOrStop();
    setCanTrack(locationStatus.canTrack);
    notification.check();
    NotificationService.configure(notification.status);
  }, [setCanTrack, notification.status]);

  useDeepCompareEffect(() => {
    debounceUpdateStateInfo();
    // refresh state if user backgrounds app
    AppState.addEventListener('change', updateStateInfo);

    // refresh state if settings change
    const unsubscribe = navigation.addListener('focus', updateStateInfo);

    return () => {
      AppState.removeEventListener('change', updateStateInfo);
      unsubscribe();
    };
  }, [
    navigation,
    updateStateInfo,
    selectedAuthorities,
    debounceUpdateStateInfo,
  ]);

  if (!canTrack) {
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
