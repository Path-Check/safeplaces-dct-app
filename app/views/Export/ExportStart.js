import React from 'react';

import ExportTemplate from './ExportTemplate';

export const ExportStart = ({ navigation }) => {
  const onNext = () => navigation.navigate('ExportSelectHA');
  const onClose = () => navigation.navigate('SettingsScreen');
  // TODO: use localized text
  return (
    <ExportTemplate
      onClose={onClose}
      onNext={onNext}
      headline={
        'Share your location history anonymously with your community if you have tested positive for COVID-19.'
      }
      body={
        'The representative from your Healthcare Authority will walk you through this process during your interview.'
      }
      nextButtonLabel={'Start'}
    />
  );
};

export default ExportStart;
