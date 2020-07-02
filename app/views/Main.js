import React, { useCallback, useEffect, useState, useContext } from 'react';
import { AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';
import ZendeskSupport from '@synapsestudios/react-native-zendesk-support';

import LocationServices from '../services/LocationService';
import NotificationService from '../services/NotificationService';
import { AllServicesOnScreen } from './main/AllServicesOn';
import {
  TracingOffScreen,
  NotificationsOffScreen,
  // SelectAuthorityScreen,
} from './main/ServiceOffScreens';
import PermissionsContext from '../gps/PermissionsContext';
import { PermissionStatus } from '../permissionStatus';

import { useSelector } from 'react-redux';
import selectedHealthcareAuthoritiesSelector from '../store/selectors/selectedHealthcareAuthoritiesSelector';
import { useStatusBarEffect } from '../navigation';

export const Main = () => {
  useStatusBarEffect('light-content');
  const navigation = useNavigation();
  const { notification } = useContext(PermissionsContext);
  const hasSelectedAuthorities =
    useSelector(selectedHealthcareAuthoritiesSelector).length > 0;
  const [canTrack, setCanTrack] = useState(true);

  const updateStateInfo = useCallback(async () => {
    const locationStatus = await LocationServices.checkStatusAndStartOrStop();
    setCanTrack(locationStatus.canTrack);
    notification.check();
    NotificationService.configure(notification.status);
  }, [setCanTrack, notification.status]);

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

  useEffect(() => {
    console.log('CONFIG')
    console.log(Config)
    const configureZendesk = async () => {
      const config = {
        appId: Config.ZENDESK_APP_ID,
        zendeskUrl: Config.ZENDESK_URL,
        clientId: Config.ZENDESK_CLIENT_ID
      }
      await ZendeskSupport.initialize(config)
  
      const identity = {
        customerEmail: 'foo@bar.com',
        customerName: 'Foo Bar'
      }
      await ZendeskSupport.setupIdentity(identity)
    }
    configureZendesk()
  }, []);

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
