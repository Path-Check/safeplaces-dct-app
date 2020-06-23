import React, { useContext } from 'react';
import { useAssets } from '../../../TracingStrategyAssets';
import { ServiceOffScreen } from './Base';
import PermissionsContext, { statusToEnum, PermissionStatus } from '../../../gps/PermissionsContext';
import { openSettings } from 'react-native-permissions';

export const NotificationsOffScreen = (): JSX.Element => {
  const {
    notificationsOffScreenHeader,
    notificationsOffScreenSubheader,
    notificationsOffScreenButton,
  } = useAssets();
  const { notification } = useContext(PermissionsContext);

  const requestNotifications = async () => {
    const status = await notification.request();
    if (statusToEnum(status) === PermissionStatus.DENIED) {
      openSettings();
    }
  };

  return (
    <ServiceOffScreen
      header={notificationsOffScreenHeader}
      subheader={notificationsOffScreenSubheader}
      button={{ label: notificationsOffScreenButton, onPress: requestNotifications }}
    />
  );
};
