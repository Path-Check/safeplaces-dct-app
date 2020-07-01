import React from 'react';
import { useTranslation } from 'react-i18next';

import DescriptionTemplate from '../common/DescriptionTemplate';
import { isGPS } from '../../COVIDSafePathsConfig';
import { Screens } from '../../navigation';
import { isPlatformiOS } from '../../Util';
import { useStrategyContent } from '../../TracingStrategyContext';

interface ShareDiagnosisProps {
  navigation: any;
}

const ShareDiagnosis = ({ navigation }: ShareDiagnosisProps): JSX.Element => {
  const { t } = useTranslation();
  const { StrategyCopy, StrategyAssets } = useStrategyContent();

  const gpsNext = () =>
    navigation.replace(
      // Skip notification permissions on android
      isPlatformiOS()
        ? Screens.OnboardingNotificationPermissions
        : Screens.OnboardingLocationPermissions,
    );

  const btNext = () => navigation.replace(Screens.NotificationPermissionsBT);

  const handleOnPressNext = isGPS ? gpsNext : btNext;

  return (
    <DescriptionTemplate
      invertIcon={isGPS}
      backgroundImage={StrategyAssets.shareDiagnosisBackground}
      iconXml={StrategyAssets.shareDiagnosisIcon}
      header={StrategyCopy.shareDiagnosisHeader}
      body={StrategyCopy.shareDiagnosisSubheader}
      primaryButtonLabel={t('label.launch_set_up_phone_location')}
      primaryButtonOnPress={handleOnPressNext}
    />
  );
};

export default ShareDiagnosis;
