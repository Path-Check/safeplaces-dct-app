import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import exitWarningAlert from './exitWarningAlert';
import ExportTemplate from './ExportTemplate';
import exportConsentApi from '../../api/export/exportConsentApi';
import { useAssets } from '../../TracingStrategyAssets';
import { isGPS } from '../../COVIDSafePathsConfig';
import { Screens } from '../../navigation';

export const ExportPublishConsent = ({ navigation, route }) => {
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

  const { selectedAuthority, code } = route.params;

  const consent = async () => {
    setIsConsenting(true);
    try {
      await exportConsentApi(selectedAuthority, true, code);
      setIsConsenting(false);
      navigation.navigate(exportPublishNextRoute, { selectedAuthority, code });
    } catch (e) {
      Alert.alert('Something went wrong');
      setIsConsenting(false);
    }
  };

  return (
    <ExportTemplate
      onClose={onClose}
      onNext={consent}
      nextButtonLabel={t('export.consent_button_title')}
      buttonSubtitle={exportPublishButtonSubtitle}
      headline={exportPublishTitle}
      body={exportPublishBody(selectedAuthority.name)}
      buttonLoading={isConsenting}
      icon={exportPublishIcon}
    />
  );
};

export default ExportPublishConsent;
