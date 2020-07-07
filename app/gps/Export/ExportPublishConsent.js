import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { useTracingStrategyContext } from '../../TracingStrategyContext';
import exitWarningAlert from './exitWarningAlert';
import ExportTemplate from './ExportTemplate';
import exportConsentApi from '../../api/export/exportConsentApi';
import { isGPS } from '../../COVIDSafePathsConfig';
import { useStrategyContent } from '../../TracingStrategyContext';
import { Screens } from '../../navigation';

export const ExportPublishConsent = ({ navigation, route }) => {
  const [isConsenting, setIsConsenting] = useState(false);
  const { t } = useTranslation();

  const { StrategyCopy } = useStrategyContent();
  const { StrategyAssets } = useTracingStrategyContext();

  const exportPublishNextRoute = isGPS
    ? Screens.ExportConfirmUpload
    : Screens.ExportComplete;
  const exportExitRoute = isGPS ? Screens.ExportStart : Screens.Settings;

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

  const onClose = () => exitWarningAlert(navigation, exportExitRoute);

  return (
    <ExportTemplate
      onClose={onClose}
      onNext={consent}
      nextButtonLabel={t('export.consent_button_title')}
      buttonSubtitle={StrategyCopy.exportPublishButtonSubtitle}
      headline={StrategyCopy.exportPublishTitle}
      body={t('export.publish_consent_body', { name: selectedAuthority.name })}
      buttonLoading={isConsenting}
      icon={StrategyAssets.exportPublishIcon}
    />
  );
};

export default ExportPublishConsent;
