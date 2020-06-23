import React, { useContext } from 'react';
import { useAssets } from '../../../TracingStrategyAssets';
import { ServiceOffScreen } from './Base';
import PermissionsContext from '../../../gps/PermissionsContext';

export const NotificationsOffScreen = (): JSX.Element => {
  const {
    notificationsOffScreenHeader,
    notificationsOffScreenSubheader,
    notificationsOffScreenButton,
  } = useAssets();
  const { notification } = useContext(PermissionsContext);

  const requestNotifications = async () => {
    await notification.request();
  };

  return (
    <ServiceOffScreen
      header={notificationsOffScreenHeader}
      subheader={notificationsOffScreenSubheader}
      button={{ label: notificationsOffScreenButton, onPress: requestNotifications }}
    />
  );
};
