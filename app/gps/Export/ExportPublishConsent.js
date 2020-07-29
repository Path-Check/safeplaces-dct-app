import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import exitWarningAlert from './exitWarningAlert';
import ExportTemplate from './ExportTemplate';
import exportConsentApi from '../../api/export/exportConsentApi';
import { Screens } from '../../navigation';
import { Icons } from '../../assets';
import { useSelector } from 'react-redux';
import { FeatureFlagOption } from '../../store/types';

export const ExportPublishConsent = ({ navigation, route }) => {
  const [isConsenting, setIsConsenting] = useState(false);
  const featureFlags = useSelector((state) => state.featureFlags?.flags || {});
  const bypassApi = !!featureFlags[FeatureFlagOption.BYPASS_EXPORT_API];
  const { t } = useTranslation();

  const { selectedAuthority, code } = route.params;

  const navigateToNextScreen = () => {
    navigation.navigate(Screens.ExportConfirmUpload, {
      selectedAuthority,
      code,
    });
  };

  const consent = async () => {
    // Bypass feature flag for allowing easy testing of screens.
    if (bypassApi) {
      navigateToNextScreen();
      return;
    }
    setIsConsenting(true);
    try {
      await exportConsentApi(selectedAuthority, true, code);
      setIsConsenting(false);
      navigateToNextScreen();
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
      buttonSubtitle={t('export.consent_button_subtitle')}
      headline={t('export.publish_consent_title')}
      body={t('export.publish_consent_body', { name: selectedAuthority.name })}
      buttonLoading={isConsenting}
      icon={Icons.Publish}
    />
  );
};

export default ExportPublishConsent;
