import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { Icons } from '../../assets';
import exitWarningAlert from './exitWarningAlert';
import ExportTemplate from './ExportTemplate';

const MOCK_ENDPOINT =
  'https://private-anon-da01e87e46-safeplaces.apiary-mock.com/consent';

export const ExportPublishConsent = ({ navigation, route }) => {
  const [isConsenting, setIsConsenting] = useState(false);
  const onClose = () => exitWarningAlert(navigation);
  const { t } = useTranslation();

  const { selectedAuthority, code } = route.params;

  const consent = async () => {
    setIsConsenting(true);
    try {
      const res = await fetch(`${MOCK_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consent: true, accessCode: code }),
      });
      const success = res.status === 200;
      if (success) {
        setIsConsenting(false);
        navigation.navigate('ExportConfirmUpload', { selectedAuthority, code });
      } else {
        setIsConsenting(false);
        throw res.status;
      }
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
