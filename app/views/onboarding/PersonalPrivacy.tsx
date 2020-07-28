import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { useStatusBarEffect } from '../../navigation';
import { useStrategyContent } from '../../TracingStrategyContext';
import ExplanationScreen, { IconStyle } from '../common/ExplanationScreen';
import { Screens } from '../../navigation';

const PersonalPrivacy: FunctionComponent = () => {
  const navigation = useNavigation();
  useStatusBarEffect('dark-content');
  const { t } = useTranslation();
  const { StrategyAssets } = useStrategyContent();

  const explanationScreenContent = {
    backgroundImage: StrategyAssets.personalPrivacyBackground,
    icon: StrategyAssets.personalPrivacyIcon,
    header: t('label.launch_screen2_header_location'),
    iconLabel: t('label.pin_icon'),
    body: t('label.launch_screen2_subheader_location'),
    primaryButtonLabel: t('label.launch_next'),
  };

  const explanationScreenStyles = {
    iconStyle: IconStyle.Blue,
  };

  const explanationScreenActions = {
    primaryButtonOnPress: () =>
      navigation.navigate(Screens.NotificationDetails),
  };

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenStyles={explanationScreenStyles}
      explanationScreenActions={explanationScreenActions}
    />
  );
};

export default PersonalPrivacy;
