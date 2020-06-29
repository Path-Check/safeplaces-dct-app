import React from 'react';
import { useTranslation } from 'react-i18next';

import { useStatusBarEffect } from '../../navigation';
import { useStrategyContent } from '../../TracingStrategyContext';
import OnboardingTemplate from './OnboardingTemplate';

const Onboarding2 = (props) => {
  useStatusBarEffect('dark-content');
  const { t } = useTranslation();
  const { StrategyAssets, StrategyCopy } = useStrategyContent();

  return (
    <OnboardingTemplate
      theme={'light'}
      background={StrategyAssets.onboarding2Background}
      iconXml={StrategyAssets.onboarding2Icon}
      title={StrategyCopy.onboarding2Header}
      body={StrategyCopy.onboarding2Subheader}
      primaryButtonLabel={t('label.launch_next')}
      primaryButtonOnPress={() => props.navigation.replace('Onboarding3')}
    />
  );
};

export default Onboarding2;
