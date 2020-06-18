import React from 'react';
import { useAssets } from '../../../TracingStrategyAssets';
import { ServiceOffScreen } from './Base';

export const NoAuthoritiesScreen = (): JSX.Element => {
  const {
    noAuthoritiesScreenHeader,
    noAuthoritiesScreenSubheader,
  } = useAssets();

  return (
    <ServiceOffScreen
      header={noAuthoritiesScreenHeader}
      subheader={noAuthoritiesScreenSubheader}
    />
  );
};
