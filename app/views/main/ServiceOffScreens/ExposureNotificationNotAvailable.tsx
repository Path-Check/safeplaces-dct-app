import React from 'react';
import { useAssets } from '../../../TracingStrategyAssets';
import { ServiceOffScreen } from './Base';

export const ExposureNotificationNotAvailableScreen = (): JSX.Element => {
  const {
    exposureNotificationsNotAvailableHeader,
    exposureNotificationsNotAvailableSubheader,
  } = useAssets();

  return (
    <ServiceOffScreen
      header={exposureNotificationsNotAvailableHeader}
      subheader={exposureNotificationsNotAvailableSubheader}
    />
  );
};
