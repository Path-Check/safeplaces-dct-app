import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { AppState, BackHandler, StatusBar, View } from 'react-native';

import { isPlatformAndroid } from './../Util';
import { Icons } from '../assets';
import { FeatureFlag } from '../components/FeatureFlag';
import { IconButton } from '../components/IconButton';
import Colors from '../constants/colors';
import { Theme } from '../constants/themes';
import { checkIntersect } from '../helpers/Intersect';
import BackgroundTaskServices from '../services/BackgroundTaskService';
import LocationServices, { Reason } from '../services/LocationService';
import LocationTracking from './LocationTracking';
import { ExposurePage } from './main/ExposurePage';
import { NoKnownExposure } from './main/NoKnownExposure';
import { OffPage } from './main/OffPage';
import { styles } from './main/style';
import { UnknownPage } from './main/UnknownPage';

const Main = () => {
  const navigation = useNavigation();
  if (isPlatformAndroid()) {
    StatusBar.setBackgroundColor(Colors.TRANSPARENT);
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(true);
  }

  const [location, setLocation] = useState({
    canTrack: true,
    reason: '',
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

  if (location.canTrack) {
    if (location.hasPotentialExposure) {
      page = <ExposurePage />;
    } else {
      page = <NoKnownExposure />;
    }
  } else {
    if (location.reason === Reason.USER_OFF) {
      page = <OffPage />;
    } else {
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

const MainNavigate = props => {
  return (
    <FeatureFlag
      name='better_location_status_checks'
      fallback={<LocationTracking {...props} />}>
      <Main />
    </FeatureFlag>
  );
};

export { Main, MainNavigate };
