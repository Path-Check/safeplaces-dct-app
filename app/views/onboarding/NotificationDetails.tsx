import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useStrategyContent } from '../../TracingStrategyContext';
import ExplanationScreen, { IconStyle } from '../common/ExplanationScreen';
import { Screens } from '../../navigation';

const NotificationDetails = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { StrategyAssets } = useStrategyContent();

  const explanationScreenContent = {
    backgroundImage: StrategyAssets.notificationDetailsBackground,
    icon: StrategyAssets.notificationDetailsIcon,
    header: t('label.launch_screen3_header_location'),
    iconLabel: t('label.heart_icon'),
    body: t('label.launch_screen3_subheader_location'),
    primaryButtonLabel: t('label.launch_next'),
  };

  const explanationScreenStyles = {
    iconStyle: IconStyle.Blue,
  };

  const explanationScreenActions = {
    primaryButtonOnPress: () => navigation.navigate(Screens.ShareDiagnosis),
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
