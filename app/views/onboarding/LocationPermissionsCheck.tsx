import React, { useCallback, useEffect, useContext } from 'react';
import { AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LocationDisabledScreen from './LocationPermissionsDisabled';
import LocationsPermissions from './LocationsPermissions';

import LocationServices from '../../services/LocationService';
import PermissionsContext from '../../gps/PermissionsContext';
import { useStatusBarEffect } from '../../navigation';
import { PermissionStatus } from '../../permissionStatus';

const LocationPermissionsCheck = (): JSX.Element => {
  useStatusBarEffect('light-content');
  const navigation = useNavigation();
  const { location } = useContext(PermissionsContext);

  const updateStateInfo = useCallback(async () => {
    await LocationServices.checkStatusAndStartOrStop();
    location.check();
  }, [location]);

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

  if (location.status === PermissionStatus.UNKNOWN) {
    return <LocationDisabledScreen />;
  } else {
    return <LocationsPermissions />;
  }
};

export default LocationPermissionsCheck;
