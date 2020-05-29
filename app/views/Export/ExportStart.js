import React from 'react';
import { useTranslation } from 'react-i18next';

import ExportTemplate from './ExportTemplate';

export const ExportStart = ({ navigation }) => {
  const { t } = useTranslation();

  const onNext = () => navigation.navigate('ExportSelectHA');
  const onClose = () => navigation.navigate('SettingsScreen');
  return (
    <ExportTemplate
      onClose={onClose}
      onNext={onNext}
      headline={t('export.start_title')}
      body={t('export.start_body')}
      nextButtonLabel={t('common.start')}
    />
  );
};

export default ExportStart;
