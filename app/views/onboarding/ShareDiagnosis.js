import React from 'react';
import { useTranslation } from 'react-i18next';

import OnboardingTemplate from './OnboardingTemplate';
import { isGPS } from '../../COVIDSafePathsConfig';
import { Screens } from '../../navigation';
import { isPlatformiOS } from '../../Util';
import { useStrategyContent } from '../../TracingStrategyContext';

const ShareDiagnosis = (props) => {
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
      invertIcon={isGPS}
      background={StrategyAssets.shareDiagnosisBackground}
      iconXml={StrategyAssets.shareDiagnosisIcon}
      title={StrategyCopy.shareDiagnosisHeader}
      body={StrategyCopy.shareDiagnosisSubheader}
      buttonLabel={t('label.launch_set_up_phone_location')}
      buttonOnPress={handleOnPressNext}
    />
  );
};

export default ShareDiagnosis;
