import React from 'react';
import { useTranslation } from 'react-i18next';

import OnboardingTemplate from './OnboardingTemplate';
import { isGPS } from '../../COVIDSafePathsConfig';
import { Screens } from '../../navigation';
import { isPlatformiOS } from '../../Util';
import { useStrategyContent } from '../../TracingStrategyContext';

const Onboarding4 = (props) => {
  const { t } = useTranslation();
  const { StrategyCopy, StrategyAssets } = useStrategyContent();

  const gpsNext = () =>
    props.navigation.replace(
      // Skip notification permissions on android
      isPlatformiOS()
        ? Screens.OnboardingNotificationPermissions
        : Screens.OnboardingLocationPermissions,
    );

  const btNext = () =>
    props.navigation.replace(Screens.EnableExposureNotifications);

  const handleOnPressNext = isGPS ? gpsNext : btNext;

  return (
    <OnboardingTemplate
      theme={'light'}
      background={StrategyAssets.onboarding4Background}
      iconXml={StrategyAssets.onboarding4Icon}
      title={StrategyCopy.onboarding4Header}
      body={StrategyCopy.onboarding4Subheader}
      buttonLabel={t('label.launch_set_up_phone_location')}
      buttonOnPress={handleOnPressNext}
    />
  );
};

export default Onboarding4;
