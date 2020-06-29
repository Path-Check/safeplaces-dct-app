import React from 'react';
import { useTranslation } from 'react-i18next';

import { ServiceOffScreen } from './Base';

export const NoAuthoritiesScreen = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <ServiceOffScreen
      header={t('home.shared.no_authorities_header')}
      subheader={t('home.shared.no_authorities_subheader')}
    />
  );
};
