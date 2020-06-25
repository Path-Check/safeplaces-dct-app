import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import exitWarningAlert from './exitWarningAlert';
import ExportTemplate from './ExportTemplate';
import { useAssets } from '../../TracingStrategyAssets';
import { isGPS } from '../../COVIDSafePathsConfig';
import { Screens } from '../../navigation';
import * as BTNativeModule from '../../bt/nativeModule';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
  NavigationRoute,
} from 'react-navigation';

interface ExportPublishConsentProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: NavigationRoute;
}

export const ExportPublishConsent = ({
  navigation,
  route,
}: ExportPublishConsentProps): JSX.Element => {
  const [isConsenting, setIsConsenting] = useState(false);
  const { t } = useTranslation();
  const {
    exportPublishBody,
    exportPublishButtonSubtitle,
    exportPublishIcon,
    exportPublishTitle,
  } = useAssets();
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
      buttonSubtitle={exportPublishButtonSubtitle}
      headline={exportPublishTitle}
      body={(exportPublishBody as (name: string) => string)(
        selectedAuthority.name,
      )}
      buttonLoading={isConsenting}
      icon={exportPublishIcon}
    />
  );
};

export default ExportPublishConsent;
