import React from 'react';
import { Linking, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import exitWarningAlert from './exitWarningAlert';
import ExportTemplate from './ExportTemplate';
import getConfigurationApi from '../../api/healthcareAuthorities/getConfigurationApi';
import { Icons } from '../../assets';
import { Screens } from '../../navigation';

// NOTE:
// We don't actually hit the consent endpoint until the next screen. These screens are tied together,
// So there is one endpoint for both parts.

export const ExportLocationConsent = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { selectedAuthority, code } = route.params;

  const onNext = () =>
    navigation.navigate(Screens.ExportPublishConsent, {
      selectedAuthority,
      code,
    });

  const onClose = () => exitWarningAlert(navigation);

  // Fetch here to ensure we show the up to date privacy policy
  const onPressLink = async () => {
    try {
      const { privacyPolicyUrl } = await getConfigurationApi(selectedAuthority);
      try {
        await Linking.openURL(privacyPolicyUrl);
      } catch (e) {
        // Isolate linking errors from api errors:
        throw new Error(`Unable to open link: ${privacyPolicyUrl}`);
      }
    } catch (e) {
      Alert.alert(t('common.something_went_wrong'), e.message);
    }
  };

  return (
    <ExportTemplate
      onClose={onClose}
      onNext={onNext}
      nextButtonLabel={t('export.consent_button_title')}
      buttonSubtitle={t('export.consent_button_subtitle')}
      headline={t('export.location_consent_title')}
      body={t('export.location_consent_body', { name: selectedAuthority.name })}
      bodyLinkText={t('export.location_consent_link')}
      bodyLinkOnPress={onPressLink}
      icon={Icons.LocationPin}
    />
  );
};

export default ExportLocationConsent;
