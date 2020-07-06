import React from 'react';
import { useTranslation } from 'react-i18next';
import { isGPS } from '../../COVIDSafePathsConfig';

import { useStrategyContent } from '../../TracingStrategyContext';
import ExplanationScreen, { IconStyle } from '../common/ExplanationScreen';

interface NotificationDetailsProps {
  navigation: any;
}

const NotificationDetails = ({
  navigation,
}: NotificationDetailsProps): JSX.Element => {
  const { t } = useTranslation();
  const { StrategyCopy, StrategyAssets } = useStrategyContent();

  const explanationScreenContent = {
    backgroundImage: StrategyAssets.notificationDetailsBackground,
    icon: StrategyAssets.notificationDetailsIcon,
    header: StrategyCopy.notificationDetailsHeader,
    body: StrategyCopy.notificationDetailsSubheader,
    primaryButtonLabel: t('label.launch_next'),
  };

  const iconStyle = isGPS ? IconStyle.Blue : IconStyle.Gold;

  const explanationScreenStyles = {
    iconStyle: iconStyle,
  };

  const explanationScreenActions = {
    primaryButtonOnPress: () => navigation.replace('ShareDiagnosis'),
  };

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenStyles={explanationScreenStyles}
      explanationScreenActions={explanationScreenActions}
    />
  );
};

export default NotificationDetails;
