import React from 'react';
import { useAssets } from '../../../TracingStrategyAssets';
import { ServiceOffScreen } from './Base';

export const TracingOffScreen = ({ onPress }): JSX.Element => {
  const {
    tracingOffScreenHeader,
    tracingOffScreenSubheader,
    tracingOffScreenButton,
  } = useAssets();

  return (
    <ServiceOffScreen
      header={tracingOffScreenHeader}
      subheader={tracingOffScreenSubheader}
      button={{ label: tracingOffScreenButton, onPress }}
    />
  );
};
