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

  const descriptionTemplateContent = {
    invertIcon: !isGPS,
    backgroundImage: StrategyAssets.notificationDetailsBackground,
    iconXml: StrategyAssets.notificationDetailsIcon,
    header: StrategyCopy.notificationDetailsHeader,
    body: StrategyCopy.notificationDetailsSubheader,
    primaryButtonLabel: t('label.launch_next'),
  };

  const descriptionTemplateActions = {
    primaryButtonOnPress: () => navigation.replace('ShareDiagnosis'),
  };

  return (
    <DescriptionTemplate
      descriptionTemplateContent={descriptionTemplateContent}
      descriptionTemplateActions={descriptionTemplateActions}
    />
  );
};

export default NotificationDetails;
