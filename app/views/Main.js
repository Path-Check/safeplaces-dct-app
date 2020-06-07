import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { AppState, BackHandler, StatusBar, View } from 'react-native';

import { isPlatformAndroid } from './../Util';
import { Icons } from '../assets';
import { IconButton } from '../components';
import Colors from '../constants/colors';
import { Theme } from '../constants/themes';
import { isGPS } from '../COVIDSafePathsConfig';
import { checkIntersect } from '../helpers/Intersect';
import BackgroundTaskServices from '../services/BackgroundTaskService';
import LocationServices, { Reason } from '../services/LocationService';
import { ExposureNotificationNotAvailablePage } from './main/ExposureNotificationNotAvailablePage';
import { ExposurePage } from './main/ExposurePage';
import { NoKnownExposure } from './main/NoKnownExposure';
import { OffPage } from './main/OffPage';
import { styles } from './main/style';
import { UnknownPage } from './main/UnknownPage';

export const Main = () => {
  const navigation = useNavigation();
  if (isPlatformAndroid()) {
    StatusBar.setBackgroundColor(Colors.TRANSPARENT);
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(true);
  }

  const [location, setLocation] = useState({
    canTrack: true,
    reason: null,
    hasPotentialExposure: false,
  });

  const SettingsNavButton = () => {
    return (
      <Theme use='violet'>
        <IconButton
          style={styles.settingsContainer}
          icon={Icons.SettingsIcon}
          size={30}
          onPress={() => {
            navigation.navigate('SettingsScreen');
          }}
          label='default'
        />
      </Theme>
    );
  };

  const checkForPossibleExposure = () => {
    BackgroundTaskServices.start();
    checkIntersect();
  };

  const updateStateInfo = useCallback(async () => {
    checkForPossibleExposure();
    const state = await LocationServices.checkStatusAndStartOrStop();
    setLocation(state);
  }, [setLocation]);

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

  if (!isGPS) {
    // A BT specific page for when Exposure Notifications are not available
    // for the Healthcare Authority chosen.
    page = <ExposureNotificationNotAvailablePage />;
  } else if (location.canTrack) {
    if (location.hasPotentialExposure) {
      page = <ExposurePage />;
    } else {
      page = <NoKnownExposure />;
    }
  } else {
    if (
      location.reason === Reason.LOCATION_OFF ||
      location.reason === Reason.NOT_AUTHORIZED
    ) {
      page = <OffPage />;
    } else {
      // Invariant violation if this occurs
      page = <UnknownPage />;
    }
  }

  return (
    <View style={styles.backgroundImage}>
      {page}
      <SettingsNavButton />
    </View>
  );
};
