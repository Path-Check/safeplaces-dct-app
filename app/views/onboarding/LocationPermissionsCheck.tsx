import React, { useCallback, useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LocationDisabledScreen from './LocationPermissionsDisabled';
import LocationsPermissions from './LocationsPermissions';

import LocationServices, { DEVICE_LOCATION_OFF } from '../../services/LocationService';
import { useStatusBarEffect } from '../../navigation';

const LocationPermissionsCheck = (): JSX.Element => {
  useStatusBarEffect('light-content');
  const navigation = useNavigation();
  const [locationServiceStatus, setLocationServiceStatus] = useState('DEVICE_LOCATION_OFF');
  const isiOS = Platform.OS === 'ios';

  const updateStateInfo = useCallback(async () => {
    const locationStatus = await LocationServices.checkStatusAndStartOrStop();
    setLocationServiceStatus(locationStatus.reason);
  }, [setLocationServiceStatus]);

  useEffect(() => {
    updateStateInfo();
    // refresh state if user backgrounds app
    AppState.addEventListener('change', updateStateInfo);

    // android only, refresh state
    if (!isiOS) {
      AppState.addEventListener('focus', updateStateInfo);
    }

    // refresh state if settings change
    const unsubscribe = navigation.addListener('focus', updateStateInfo);

    return () => {
      AppState.removeEventListener('change', updateStateInfo);
      if (!isiOS) {
        AppState.removeEventListener('focus', updateStateInfo);
      }
      unsubscribe();
    };
  }, [navigation, updateStateInfo]);

  if (locationServiceStatus === DEVICE_LOCATION_OFF) {
    return <LocationDisabledScreen />;
  } else {
    return <LocationsPermissions />;
  }
};

export default LocationPermissionsCheck;
