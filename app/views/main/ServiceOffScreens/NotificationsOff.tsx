import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { ServiceOffScreen } from './Base';
import PermissionsContext from '../../../gps/PermissionsContext';

export const NotificationsOffScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const { requestNotificationSettings } = useContext(PermissionsContext);

  return (
    <ServiceOffScreen
      header={t('home.shared.notifications_off_header')}
      subheader={t('home.shared.notifications_off_subheader')}
      button={{
        label: t('home.shared.notifications_off_button'),
        onPress: requestNotificationSettings,
      }}
    />
  );
};
