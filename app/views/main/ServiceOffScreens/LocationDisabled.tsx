import React from 'react';
import { ServiceOffScreen } from './Base';

export const LocationDisabledScreen = (): JSX.Element => {
  // const { t } = useTranslation();

  return (
    <ServiceOffScreen
      header='location disabled on os level'
      subheader='please enable location in settings'
    />
  );
};
