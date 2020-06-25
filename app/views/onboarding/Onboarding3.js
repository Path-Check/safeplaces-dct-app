import React from 'react';
import { useAssets } from '../../TracingStrategyAssets';
import { useTranslation } from 'react-i18next';
import OnboardingTemplate from './OnboardingTemplate';

const Onboarding3 = (props) => {
  const {
    onboarding3Background,
    onboarding3Header,
    onboarding3Subheader,
    onboarding3Icon,
  } = useAssets();
  const { t } = useTranslation();

  return (
    <OnboardingTemplate
      theme={'light'}
      background={onboarding3Background}
      iconXml={onboarding3Icon}
      title={onboarding3Header}
      body={onboarding3Subheader}
      primaryButtonLabel={t('label.launch_next')}
      primaryButtonOnPress={() => props.navigation.replace('Onboarding4')}
    />
  );
};

export default Onboarding3;
