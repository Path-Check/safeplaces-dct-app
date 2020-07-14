import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, NativeModules } from 'react-native';

import exitWarningAlert from './exitWarningAlert';
import ExportTemplate from './ExportTemplate';
import exportUploadApi from '../../api/export/exportUploadApi';
import { Screens } from '../../navigation';
import { Icons } from '../../assets';
import { useSelector } from 'react-redux';
import { FeatureFlagOption } from '../../store/types';

export const ExportComplete = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const featureFlags = useSelector((state) => state.featureFlags?.flags || {});
  const bypassApi = !!featureFlags[FeatureFlagOption.BYPASS_EXPORT_API];

  const onClose = () => exitWarningAlert(navigation);

  const { selectedAuthority, code } = route.params;

  const upload = async () => {
    // Bypass API to allow easy testing of screens
    if (bypassApi) {
      navigation.navigate(Screens.ExportComplete);
      return;
    }
    setIsUploading(true);
    try {
      const concernPoints = await NativeModules.SecureStorageManager.getLocations();
      await exportUploadApi(selectedAuthority, concernPoints, code);
      navigation.navigate(Screens.ExportComplete);
      setIsUploading(false);
    } catch (e) {
      Alert.alert(t('common.something_went_wrong'), e.message);
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
