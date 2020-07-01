import React from 'react';
import { useTranslation } from 'react-i18next';
import { isGPS } from '../../COVIDSafePathsConfig';

import { useStrategyContent } from '../../TracingStrategyContext';
import DescriptionTemplate from '../common/DescriptionTemplate';

interface NotificationDetailsProps {
  navigation: any;
}

const NotificationDetails = ({
  navigation,
}: NotificationDetailsProps): JSX.Element => {
  const { t } = useTranslation();
  const { StrategyCopy, StrategyAssets } = useStrategyContent();

  return (
    <DescriptionTemplate
      invertIcon={!isGPS}
      background={StrategyAssets.notificationDetailsBackground}
      iconXml={StrategyAssets.notificationDetailsIcon}
      title={StrategyCopy.notificationDetailsHeader}
      body={StrategyCopy.notificationDetailsSubheader}
      primaryButtonLabel={t('label.launch_next')}
      primaryButtonOnPress={() => navigation.replace('ShareDiagnosis')}
    />
  );
};

export default NotificationDetails;
