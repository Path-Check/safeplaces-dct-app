import React from 'react';
import { useAssets } from '../../TracingStrategyAssets';
import { useTranslation } from 'react-i18next';
import OnboardingTemplate from './OnboardingTemplate';
import { isGPS } from '../../COVIDSafePathsConfig';
import { Screens } from '../../navigation';

const Onboarding4 = (props) => {
  const {
    onboarding4Background,
    onboarding4Header,
    onboarding4Subheader,
    onboarding4Icon,
  } = useAssets();
  const { t } = useTranslation();

  const handleOnPressNext = () =>
    props.navigation.replace(
      isGPS
        ? Screens.OnboardingNotificationPermissions
        : Screens.EnableExposureNotifications,
    );

  return (
    <OnboardingTemplate
      theme={'light'}
      invertIcon
      background={onboarding4Background}
      iconXml={onboarding4Icon}
      title={onboarding4Header}
      body={onboarding4Subheader}
      primaryButtonLabel={t('label.launch_set_up_phone_location')}
      primaryButtonOnPress={handleOnPressNext}
    />
  );
};

export default Onboarding4;
