import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { ServiceOffScreen } from './Base';
import PermissionsContext from '../../../gps/PermissionsContext';

export const TracingOffScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const { requestLocationSettings } = useContext(PermissionsContext);

  return (
    <ServiceOffScreen
      header={t('home.gps.tracing_off_header')}
      subheader={t('home.gps.tracing_off_subheader')}
      button={{
        label: t('home.gps.tracing_off_button'),
        onPress: requestLocationSettings,
      }}
    />
  );
};
