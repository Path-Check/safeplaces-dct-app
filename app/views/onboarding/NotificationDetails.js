import React from 'react';
import { useTranslation } from 'react-i18next';
import { isGPS } from '../../COVIDSafePathsConfig';

import { useStrategyContent } from '../../TracingStrategyContext';
import DescriptionTemplate from '../common/DescriptionTemplate';

const NotificationDetails = (props) => {
  const { t } = useTranslation();
  const { StrategyCopy, StrategyAssets } = useStrategyContent();

  return (
    <DescriptionTemplate
      theme={'light'}
      invertIcon={!isGPS}
      background={StrategyAssets.notificationDetailsBackground}
      iconXml={StrategyAssets.notificationDetailsIcon}
      title={StrategyCopy.notificationDetailsHeader}
      body={StrategyCopy.notificationDetailsSubheader}
      buttonLabel={t('label.launch_next')}
      buttonOnPress={() => props.navigation.replace('ShareDiagnosis')}
    />
  );
};

export default NotificationDetails;
