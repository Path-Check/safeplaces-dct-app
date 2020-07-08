import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import exitWarningAlert from './exitWarningAlert';
import ExportTemplate from './ExportTemplate';
import exportConsentApi from '../../api/export/exportConsentApi';
import { useStrategyContent } from '../../TracingStrategyContext';
import { Screens } from '../../navigation';
import { Icons } from '../../assets';

export const ExportPublishConsent = ({ navigation, route }) => {
  const [isConsenting, setIsConsenting] = useState(false);
  const { t } = useTranslation();

  const { StrategyCopy } = useStrategyContent();
  const { selectedAuthority, code } = route.params;

  const consent = async () => {
    setIsConsenting(true);
    try {
      await exportConsentApi(selectedAuthority, true, code);
      setIsConsenting(false);
      navigation.navigate(Screens.ExportComplete, { selectedAuthority, code });
    } catch (e) {
      Alert.alert(t('common.something_went_wrong'), e.message);
      setIsConsenting(false);
    }
  };

  const onClose = () => exitWarningAlert(navigation, Screens.ExportStart);

  return (
    <ExportTemplate
      onClose={onClose}
      onNext={consent}
      nextButtonLabel={t('export.consent_button_title')}
      buttonSubtitle={StrategyCopy.exportPublishButtonSubtitle}
      headline={StrategyCopy.exportPublishTitle}
      body={t('export.publish_consent_body', { name: selectedAuthority.name })}
      buttonLoading={isConsenting}
      icon={Icons.Publish}
    />
  );
};

export default ExportPublishConsent;
