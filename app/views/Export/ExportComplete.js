import React from 'react';

import ExportTemplate from './ExportTemplate';

export const ExportComplete = ({ navigation }) => {
  const onClose = () => navigation.navigate('SettingsScreen');

  // TODO: use localized text
  return (
    <ExportTemplate
      lightTheme
      onClose={onClose}
      onNext={onClose}
      nextButtonLabel={'Done'}
      headline={'Thanks for keeping your community safe!'}
      body={`By sharing your health status and location history anonymously with your community, you’re being proactive about fighting the spread of COVID-19.`}
    />
  );
};

export default ExportComplete;
