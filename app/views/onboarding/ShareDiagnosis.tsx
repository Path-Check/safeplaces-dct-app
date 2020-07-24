import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { Screens } from '../../navigation';
import { isPlatformiOS } from '../../Util';
import { useStrategyContent } from '../../TracingStrategyContext';
import ExplanationScreen, { IconStyle } from '../common/ExplanationScreen';

const ShareDiagnosis: FunctionComponent = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { StrategyCopy, StrategyAssets } = useStrategyContent();

  const onNext = () => {
    return navigation.navigate(
      // Skip notification permissions on android
      isPlatformiOS()
        ? Screens.OnboardingNotificationPermissions
        : Screens.OnboardingLocationPermissions,
    );
  };

  const explanationScreenContent = {
    backgroundImage: StrategyAssets.shareDiagnosisBackground,
    icon: StrategyAssets.shareDiagnosisIcon,
    iconLabel: StrategyCopy.shareDiagnosisIconLabel,
    header: StrategyCopy.shareDiagnosisHeader,
    body: StrategyCopy.shareDiagnosisSubheader,
    primaryButtonLabel: t('label.launch_set_up_phone_location'),
  };

  const explanationScreenStyles = {
    iconStyle: IconStyle.Blue,
  };

  const explanationScreenActions = {
    primaryButtonOnPress: onNext,
  };

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenStyles={explanationScreenStyles}
      explanationScreenActions={explanationScreenActions}
    />
  );
};

export default ShareDiagnosis;
