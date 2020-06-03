import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icons } from '../../assets';
import exitWarningAlert from './exitWarningAlert';
import ExportTemplate from './ExportTemplate';

// NOTE:
// We don't actually hit the consent endpoint until the next screen. These screens are tied together,
// So there is one endpoint for both parts.

export const ExportLocationConsent = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { selectedAuthority, code } = route.params;

  const onNext = () =>
    navigation.navigate('ExportPublishConsent', { selectedAuthority, code });

  const onClose = () => exitWarningAlert(navigation);

  return (
    <ExportTemplate
      onClose={onClose}
      onNext={onNext}
      nextButtonLabel={t('export.consent_button_title')}
      buttonSubtitle={t('export.consent_button_subtitle')}
      headline={t('export.location_consent_title')}
      body={t('export.location_consent_body', { name: selectedAuthority.name })}
      icon={Icons.LocationPin}
    />
  );
};

export default ExportLocationConsent;
