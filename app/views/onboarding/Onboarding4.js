import React from 'react';
import { useAssets } from '../../TracingStrategyAssets';
import { useTranslation } from 'react-i18next';
import OnboardingTemplate from './OnboardingTemplate';
import { isGPS } from '../../COVIDSafePathsConfig';
import { Screens } from '../../navigation';
import { isPlatformiOS } from '../../Util';

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
        ? // Skip notification permissions on android
          isPlatformiOS()
          ? Screens.OnboardingNotificationPermissions
          : Screens.OnboardingLocationPermissions
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
