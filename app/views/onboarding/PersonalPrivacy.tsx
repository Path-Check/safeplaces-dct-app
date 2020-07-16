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
  const { StrategyAssets, StrategyCopy } = useStrategyContent();

  const explanationScreenContent = {
    backgroundImage: StrategyAssets.personalPrivacyBackground,
    icon: StrategyAssets.personalPrivacyIcon,
    header: StrategyCopy.personalPrivacyHeader,
    body: StrategyCopy.personalPrivacySubheader,
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
