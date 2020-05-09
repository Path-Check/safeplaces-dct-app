import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AppState, BackHandler, StatusBar, View } from 'react-native';

import settingsIcon from './../assets/svgs/settingsIcon';
import { isPlatformAndroid } from './../Util';
import { Feature } from '../components/Feature';
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

  const SettingsIcon = () => {
    return (
      <Theme use='violet'>
        <IconButton
          style={styles.settingsContainer}
          icon={settingsIcon}
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

  const updateStateInfo = async () => {
    checkForPossibleExposure();
    const state = await LocationServices.checkStatus();
    setLocation(state);
  };

  const handleBackPress = () => {
    BackHandler.exitApp(); // works best when the goBack is async
    return true;
  };

  useEffect(() => {
    updateStateInfo();
    // refresh state if user backgrounds app
    AppState.addEventListener('change', () => {
      updateStateInfo();
    });
    // refresh state if settings change
    const unsubscribe = navigation.addListener('focus', () => {
      updateStateInfo();
    });
    // handle back press
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      AppState.removeEventListener('change', updateStateInfo());
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      unsubscribe();
    };
  }, []);

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
      <SettingsIcon />
    </View>
  );
};

const MainNavigate = props => {
  return (
    <Feature
      name='better_location_status_checks'
      fallback={() => <LocationTracking {...props} />}>
      <Main />
    </Feature>
  );
};

export { Main, MainNavigate };
