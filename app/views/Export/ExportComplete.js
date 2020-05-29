import React from 'react';
import { useTranslation } from 'react-i18next';

import ExportTemplate from './ExportTemplate';

export const ExportComplete = ({ navigation }) => {
  const onClose = () => navigation.navigate('SettingsScreen');
  const { t } = useTranslation();

  return (
    <ExportTemplate
      lightTheme
      onClose={onClose}
      onNext={onClose}
      nextButtonLabel={t('common.done')}
      headline={t('export.complete_title')}
      body={t('export.complete_body')}
    />
  );
};

export default ExportComplete;
