import React from 'react';

import { Icons } from '../../assets';
import ExportTemplate from './ExportTemplate';

// NOTE:
// We don't actually hit the consent endpoint until the next screen. These screens are tied together,
// So there is one endpoint for both parts.

export const ExportLocationConsent = ({ navigation, route }) => {
  const { selectedAuthority, code } = route.params;

  const onNext = () =>
    navigation.navigate('ExportPublishConsent', { selectedAuthority, code });
  const onClose = () => navigation.navigate('SettingsScreen');

  // TODO: use localized text
  return (
    <ExportTemplate
      onClose={onClose}
      onNext={onNext}
      nextButtonLabel={'I understand and consent'}
      headline={'Use of location history'}
      body={`Your location history is used by representatives of ${selectedAuthority.name} to interview you about places you visited and when you were there.\n\nOnce you send your location history to ${selectedAuthority.name}, they will retain your data for a specific period of time. Please view their privacy policy here.`}
      buttonSubtitle={
        'By proceeding, you agree that your Heathcare Authority can retain your data for a period of time.'
      }
      icon={Icons.LocationPin}
    />
  );
};

export default ExportLocationConsent;
