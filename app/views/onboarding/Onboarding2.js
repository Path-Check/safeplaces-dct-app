import React from 'react';
import { useAssets } from '../../TracingStrategyAssets';
import { useTranslation } from 'react-i18next';
import { useStatusBarEffect } from '../../navigation';
import OnboardingTemplate from './OnboardingTemplate';

const Onboarding2 = (props) => {
  const {
    onboarding2Background,
    onboarding2Header,
    onboarding2Subheader,
    onboarding2Icon,
  } = useAssets();

  const { t } = useTranslation();
  useStatusBarEffect('dark-content');

  return (
    <OnboardingTemplate
      theme={'light'}
      background={onboarding2Background}
      iconXml={onboarding2Icon}
      title={onboarding2Header}
      body={onboarding2Subheader}
      primaryButtonLabel={t('label.launch_next')}
      primaryButtonOnPress={() => props.navigation.replace('Onboarding3')}
    />
  );
};

export default Onboarding2;
