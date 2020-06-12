import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { AppState, BackHandler, StatusBar, View } from 'react-native';

import { isPlatformAndroid } from './../Util';
import Colors from '../constants/colors';
import { isGPS } from '../COVIDSafePathsConfig';
import { checkIntersect } from '../helpers/Intersect';
import BackgroundTaskServices from '../services/BackgroundTaskService';
import LocationServices from '../services/LocationService';
import ExposureNotificationService from '../services/ExposureNotificationService';
import { ExposurePage } from './main/ExposurePage';
import { NoKnownExposure } from './main/NoKnownExposure';
import { OffPage } from './main/OffPage';
import { styles } from './main/style';
import { UnknownPage } from './main/UnknownPage';

export const Main = () => {
  const tracingService = isGPS ? LocationServices : ExposureNotificationService;
  const navigation = useNavigation();
  if (isPlatformAndroid()) {
    StatusBar.setBackgroundColor(Colors.TRANSPARENT);
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(true);
  }

  const [trackingInfo, setTrackingInfo] = useState({
    canTrack: true,
    reason: null,
    hasPotentialExposure: false,
  });

  const checkForPossibleExposure = () => {
    if (isGPS) {
      BackgroundTaskServices.start();
      checkIntersect();
    }
  };

  const updateStateInfo = useCallback(async () => {
    checkForPossibleExposure();
    const state = await tracingService.checkStatusAndStartOrStop();
    setTrackingInfo(state);
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

  let page;

  if (trackingInfo.canTrack) {
    if (trackingInfo.hasPotentialExposure) {
      page = <ExposurePage />;
    } else {
      page = <NoKnownExposure />;
    }
  } else {
    if (
      trackingInfo.reason === tracingService.DEVICE_LOCATION_OFF ||
      trackingInfo.reason === tracingService.APP_NOT_AUTHORIZED ||
      trackingInfo.reason === tracingService.DEVICE_EXPOSURE_NOTIFICATIONS_OFF
    ) {
      page = <OffPage />;
    } else {
      // Invariant violation if this occurs
      page = <UnknownPage />;
    }
  }

  return <View style={styles.backgroundImage}>{page}</View>;
};
