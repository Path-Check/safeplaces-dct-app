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
  NoAuthoritiesScreen,
} from './main/ServiceOffScreens';
import { styles } from './main/style';
import PermissionsContext, { PermissionStatus } from '../PermissionsContext';
import { HCAService } from '../services/HCAService';

import { Colors } from '../styles';

export const Main = () => {
  const tracingService = isGPS ? LocationServices : ExposureNotificationService;
  const navigation = useNavigation();
  const { notification } = useContext(PermissionsContext);
  const [hasAuthorityInBounds, setHasAuthorityInBounds] = useState(undefined);
  const [hasSavedAuthorities, setHasSavedAuthorities] = useState(undefined);

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

    if (isGPS) {
      const authoritiesInBoundsState = await HCAService.hasAuthoritiesInBounds();
      setHasAuthorityInBounds(authoritiesInBoundsState);

      const savedAuthoritiesState = await HCAService.hasSavedAuthorities();
      setHasSavedAuthorities(savedAuthoritiesState);
    }
  }, [
    tracingService,
    setTrackingInfo,
    setHasAuthorityInBounds,
    setHasSavedAuthorities,
  ]);

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
  } else if (hasAuthorityInBounds === false) {
    screen = <NoAuthoritiesScreen />;
  } else if (hasSavedAuthorities === false) {
    screen = <SelectAuthorityScreen />;
  } else {
    screen = <AllServicesOnScreen />;
  }

  return <View style={styles.backgroundImage}>{screen}</View>;
};
