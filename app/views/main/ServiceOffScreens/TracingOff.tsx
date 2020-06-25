import React, { useContext } from 'react';
import { useAssets } from '../../../TracingStrategyAssets';
import { ServiceOffScreen } from './Base';
import PermissionsContext from '../../../gps/PermissionsContext';

export const TracingOffScreen = (): JSX.Element => {
  const {
    tracingOffScreenHeader,
    tracingOffScreenSubheader,
    tracingOffScreenButton,
  } = useAssets();
  const { requestLocationSettings } = useContext(PermissionsContext);

  return (
    <ServiceOffScreen
      header={tracingOffScreenHeader}
      subheader={tracingOffScreenSubheader}
      button={{
        label: tracingOffScreenButton,
        onPress: requestLocationSettings,
      }}
    />
  );
};
