import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { Icons } from '../../assets';
import exitWarningAlert from './exitWarningAlert';
import ExportTemplate from './ExportTemplate';
import exportConsentApi from '../../api/export/exportConsentApi';
export const ExportPublishConsent = ({ navigation, route }) => {
  const [isConsenting, setIsConsenting] = useState(false);
  const onClose = () => exitWarningAlert(navigation);
  const { t } = useTranslation();

  const { selectedAuthority, code } = route.params;

  const consent = async () => {
    setIsConsenting(true);
    try {
      await exportConsentApi(selectedAuthority, true, code);
      setIsConsenting(false);
      navigation.navigate('ExportConfirmUpload', { selectedAuthority, code });
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
      buttonSubtitle={t('export.consent_button_subtitle')}
      headline={t('export.publish_consent_title')}
      body={t('export.publish_consent_body', { name: selectedAuthority.name })}
      buttonLoading={isConsenting}
      icon={Icons.Publish}
    />
  );
};

export default ExportPublishConsent;
