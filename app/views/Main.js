import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState, useContext } from 'react';
import { AppState, BackHandler, StatusBar, View } from 'react-native';

import { isPlatformAndroid } from './../Util';
import { isGPS } from '../COVIDSafePathsConfig';
import { checkIntersect } from '../helpers/Intersect';
import BackgroundTaskServices from '../services/BackgroundTaskService';
import LocationServices from '../services/LocationService';
import ExposureNotificationService from '../services/ExposureNotificationService';
import { AllServicesOnScreen } from './main/AllServicesOn';
import {
  TracingOffScreen,
  NotificationsOffScreen,
  SelectAuthorityScreen,
} from './main/ServiceOffScreens';
import { styles } from './main/style';
import PermissionsContext, { PermissionStatus } from '../PermissionsContext';

import { Colors } from '../styles';
import { useSelector } from 'react-redux';
import selectedHealthcareAuthoritiesSelector from '../store/selectors/selectedHealthcareAuthoritiesSelector';

export const Main = () => {
  const tracingService = isGPS ? LocationServices : ExposureNotificationService;
  const navigation = useNavigation();
  const { notification } = useContext(PermissionsContext);
  const hasSelectedAuthorities =
    useSelector(selectedHealthcareAuthoritiesSelector).length > 0;

  if (isPlatformAndroid()) {
    StatusBar.setBackgroundColor(Colors.transparent);
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(true);
  }

  const [trackingInfo, setTrackingInfo] = useState({ canTrack: true });

  const checkForPossibleExposure = () => {
    if (isGPS) {
      BackgroundTaskServices.start();
      checkIntersect();
    }
  };

  const updateStateInfo = useCallback(async () => {
    checkForPossibleExposure();
    const { canTrack } = await tracingService.checkStatusAndStartOrStop();
    setTrackingInfo({ canTrack });
  }, [tracingService, setTrackingInfo]);

  const handleBackPress = () => {
    BackHandler.exitApp(); // works best when the goBack is async
    return true;
  };

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

  let screen;

  if (!trackingInfo.canTrack) {
    screen = <TracingOffScreen />;
  } else if (notification.status === PermissionStatus.DENIED) {
    screen = <NotificationsOffScreen />;
  } else if (hasSelectedAuthorities === false) {
    screen = <SelectAuthorityScreen />;
  } else {
    screen = <AllServicesOnScreen />;
  }

  return <View style={styles.backgroundImage}>{screen}</View>;
};
