import React from 'react';
import { useTranslation } from 'react-i18next';

import { isGPS } from '../../COVIDSafePathsConfig';
import { Screens } from '../../navigation';
import { isPlatformiOS } from '../../Util';
import { useStrategyContent } from '../../TracingStrategyContext';
import ExplanationScreen, { IconStyle } from '../common/ExplanationScreen';

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

  const descriptionTemplateContent = {
    backgroundImage: StrategyAssets.shareDiagnosisBackground,
    icon: StrategyAssets.shareDiagnosisIcon,
    header: StrategyCopy.shareDiagnosisHeader,
    body: StrategyCopy.shareDiagnosisSubheader,
    primaryButtonLabel: t('label.launch_set_up_phone_location'),
  };

  const iconStyle = isGPS ? IconStyle.Gold : IconStyle.Blue;

  const descriptionTemplateStyles = {
    iconStyle: iconStyle,
  };

  const descriptionTemplateActions = {
    primaryButtonOnPress: handleOnPressNext,
  };

  return (
    <ExplanationScreen
      descriptionTemplateContent={descriptionTemplateContent}
      descriptionTemplateStyles={descriptionTemplateStyles}
      descriptionTemplateActions={descriptionTemplateActions}
    />
  );
};

export default ShareDiagnosis;
