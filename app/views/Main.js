import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState, useContext } from 'react';
import { AppState, BackHandler, StatusBar } from 'react-native';
import { openSettings } from 'react-native-permissions';

import { isPlatformAndroid } from './../Util';
import { checkIntersect } from '../helpers/Intersect';
import BackgroundTaskServices from '../services/BackgroundTaskService';
import LocationServices from '../services/LocationService';
import { AllServicesOnScreen } from './main/AllServicesOn';
import {
  TracingOffScreen,
  NotificationsOffScreen,
  SelectAuthorityScreen,
} from './main/ServiceOffScreens';
import PermissionsContext, { PermissionStatus } from '../PermissionsContext';
import ExposureNotificationsContext from '../ExposureNotificationContext';

import { Colors } from '../styles';
import { useSelector } from 'react-redux';
import selectedHealthcareAuthoritiesSelector from '../store/selectors/selectedHealthcareAuthoritiesSelector';

export const BTMain = () => {
  if (isPlatformAndroid()) {
    StatusBar.setBackgroundColor(Colors.transparent);
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(true);
  }

  const [isENAuthorizedAndEnabled, setIsENAuthorizedAndEnabled] = useState(
    false,
  );
  const {
    getIsENAuthorizedAndEnabled,
    requestENAuthorization,
    deviceStatus,
  } = useContext(ExposureNotificationsContext);
  console.log('Auth status: ', getIsENAuthorizedAndEnabled());

  useEffect(() => {
    console.log('STATUS: ', deviceStatus);
    setIsENAuthorizedAndEnabled(getIsENAuthorizedAndEnabled());
  }, [deviceStatus, getIsENAuthorizedAndEnabled]);

  if (isENAuthorizedAndEnabled) {
    return <AllServicesOnScreen />;
  } else {
    return <TracingOffScreen onPress={requestENAuthorization} />;
  }
};

export const Main = () => {
  if (isPlatformAndroid()) {
    StatusBar.setBackgroundColor(Colors.transparent);
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(true);
  }

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

    // handle back press
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      AppState.removeEventListener('change', updateStateInfo);
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      unsubscribe();
    };
  }, [navigation, updateStateInfo]);

  const handleBackPress = () => {
    BackHandler.exitApp(); // works best when the goBack is async
    return true;
  };

  if (!trackingInfo.canTrack) {
    return <TracingOffScreen onPress={openSettings} />;
  } else if (notification.status === PermissionStatus.DENIED) {
    return <NotificationsOffScreen />;
  } else if (hasSelectedAuthorities === false) {
    return <SelectAuthorityScreen />;
  } else {
    return <AllServicesOnScreen />;
  }
};
