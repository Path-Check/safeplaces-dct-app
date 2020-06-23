import React from 'react';
import { openSettings } from 'react-native-permissions';
import { useAssets } from '../../../TracingStrategyAssets';
import { ServiceOffScreen } from './Base';

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
      button={{
        label: notificationsOffScreenButton,
        onPress: openSettings,
      }}
    />
  );
};
