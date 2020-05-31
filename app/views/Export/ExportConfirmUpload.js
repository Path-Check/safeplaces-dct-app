import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, NativeModules } from 'react-native';

import { Icons } from '../../assets';
import exitWarningAlert from './exitWarningAlert';
import ExportTemplate from './ExportTemplate';

const MOCK_ENDPOINT =
  'https://private-anon-da01e87e46-safeplaces.apiary-mock.com/upload';

export const ExportComplete = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const onClose = () => exitWarningAlert(navigation);

  const { selectedAuthority, code } = route.params;

  const upload = async () => {
    setIsUploading(true);
    try {
      const concernPoints = await NativeModules.SecureStorageManager.getLocations();
      const res = await fetch(MOCK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode: code, concernPoints }),
      });
      const success = res.status === 201;
      if (success) {
        navigation.navigate('ExportComplete');
      } else {
        throw res.status;
      }
      setIsUploading(false);
    } catch (e) {
      Alert.alert(t('common.something_went_wrong'));
      setIsUploading(false);
    }
  };

  return (
    <ExportTemplate
      onClose={onClose}
      onNext={upload}
      nextButtonLabel={t('export.confirm_upload_button')}
      headline={t('export.confirm_upload_title')}
      body={t('export.confirm_upload_body', { name: selectedAuthority.name })}
      icon={Icons.Upload}
      buttonLoading={isUploading}
    />
  );
};

export default ExportComplete;
