import React from 'react';
import { useTranslation } from 'react-i18next';

import { useStrategyContent } from '../../TracingStrategyContext';
import Template from './Template';

const NotificatioNDetails = (props) => {
  const { t } = useTranslation();
  const { StrategyCopy, StrategyAssets } = useStrategyContent();

  return (
    <Template
      theme={'light'}
      invertIcon
      background={StrategyAssets.notificationDetailsBackground}
      iconXml={StrategyAssets.notificationDetailsIcon}
      title={StrategyCopy.notificationDetailsHeader}
      body={StrategyCopy.notificationDetailsSubheader}
      buttonLabel={t('label.launch_next')}
      buttonOnPress={() => props.navigation.replace('ShareDiagnosis')}
    />
  );
};

export default NotificatioNDetails;
