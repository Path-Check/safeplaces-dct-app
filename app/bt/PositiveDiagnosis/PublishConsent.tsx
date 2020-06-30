import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
  NavigationRoute,
} from 'react-navigation';

import exitWarningAlert from '../../views/Export/exitWarningAlert';
import ExportTemplate from '../../views/Export/ExportTemplate';
import { useStrategyContent } from '../../TracingStrategyContext';
import { isGPS } from '../../COVIDSafePathsConfig';
import { Screens } from '../../navigation';
import * as BTNativeModule from '../nativeModule';

interface PublishConsentProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: NavigationRoute;
}

export const PublishConsent = ({
  navigation,
  route,
}: PublishConsentProps): JSX.Element => {
  const [isConsenting, setIsConsenting] = useState(false);
  const { t } = useTranslation();

  const {
    InterpolatedStrategyCopy,
    StrategyCopy,
    StrategyAssets,
  } = useStrategyContent();

  const exportPublishNextRoute = isGPS
    ? Screens.ExportConfirmUpload
    : Screens.ExportComplete;
  const exportExitRoute = isGPS ? Screens.ExportStart : Screens.Settings;
  const onClose = () => exitWarningAlert(navigation, exportExitRoute);

  const selectedAuthority = route.params?.selectedAuthority;
  const code = route.params?.code;

  const consent = async () => {
    setIsConsenting(true);
    const cb = (errorMessage: string, successMessage: string) => {
      if (successMessage != null) {
        navigation.navigate(exportPublishNextRoute, {
          selectedAuthority,
          code,
        });
      } else {
        Alert.alert(errorMessage);
      }
      setIsConsenting(false);
    };
    BTNativeModule.submitDiagnosisKeys(cb);
  };

  return (
    <ExportTemplate
      onClose={onClose}
      onNext={consent}
      nextButtonLabel={t('export.consent_button_title')}
      buttonSubtitle={StrategyCopy.exportPublishButtonSubtitle}
      headline={StrategyCopy.exportPublishTitle}
      body={InterpolatedStrategyCopy.exportPublishBody(selectedAuthority.name)}
      buttonLoading={isConsenting}
      icon={StrategyAssets.exportPublishIcon}
    />
  );
};

export default PublishConsent;
