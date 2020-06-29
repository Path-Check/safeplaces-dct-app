import React from 'react';
import { useTranslation } from 'react-i18next';

import { useStrategyContent } from '../../TracingStrategyContext';
import OnboardingTemplate from './OnboardingTemplate';

const Onboarding3 = (props) => {
  const { t } = useTranslation();
  const { StrategyCopy, StrategyAssets } = useStrategyContent();

  return (
    <OnboardingTemplate
      theme={'light'}
      invertIcon
      background={StrategyAssets.onboarding3Background}
      iconXml={StrategyAssets.onboarding3Icon}
      title={StrategyCopy.onboarding3Header}
      body={StrategyCopy.onboarding3Subheader}
      buttonLabel={t('label.launch_next')}
      buttonOnPress={() => props.navigation.replace('Onboarding4')}
    />
  );
};

export default Onboarding3;
