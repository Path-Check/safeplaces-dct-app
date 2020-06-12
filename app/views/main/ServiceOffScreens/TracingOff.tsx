import React from 'react';
import { useAssets } from '../../../TracingStrategyAssets';
import { ServiceOffScreen } from './Base';
import { openSettings } from 'react-native-permissions';

export const TracingOffScreen = (): JSX.Element => {
  const {
    tracingOffScreenHeader,
    tracingOffScreenSubheader,
    tracingOffScreenButton,
  } = useAssets();

  return (
    <ServiceOffScreen
      header={tracingOffScreenHeader}
      subheader={tracingOffScreenSubheader}
      button={{ label: tracingOffScreenButton, onPress: openSettings }}
    />
  );
};
