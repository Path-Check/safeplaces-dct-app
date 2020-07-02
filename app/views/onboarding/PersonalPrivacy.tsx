import React from 'react';
import { useTranslation } from 'react-i18next';

import { useStatusBarEffect } from '../../navigation';
import { useStrategyContent } from '../../TracingStrategyContext';
import ExplanationScreen, { IconStyle } from '../common/ExplanationScreen';

interface PersonalPrivacyProps {
  navigation: any;
}

const PersonalPrivacy = ({ navigation }: PersonalPrivacyProps): JSX.Element => {
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
    primaryButtonOnPress: () => navigation.replace('NotificatioNDetails'),
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
