import React from 'react';
import { useAssets } from '../../../TracingStrategyAssets';
import { ServiceOffScreen } from './Base';
import { openSettings } from 'react-native-permissions';

export const NotificationsOffScreen = (): JSX.Element => {
  const {
    notificationsOffScreenHeader,
    notificationsOffScreenSubheader,
    notificationsOffScreenButton,
  } = useAssets();

  return (
    <ServiceOffScreen
      header={notificationsOffScreenHeader}
      subheader={notificationsOffScreenSubheader}
      button={{ label: notificationsOffScreenButton, onPress: openSettings }}
    />
  );
};
