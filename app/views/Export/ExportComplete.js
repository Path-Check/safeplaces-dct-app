import React from 'react';
import { useTranslation } from 'react-i18next';

import ExportTemplate from './ExportTemplate';

export const ExportComplete = ({ navigation }) => {
  const onClose = () => navigation.navigate('ExportStart');
  const { t } = useTranslation();

  return (
    <ExportTemplate
      lightTheme
      onNext={onClose}
      nextButtonLabel={t('common.done')}
      headline={t('export.complete_title')}
      body={t('export.complete_body')}
    />
  );
};

export default ExportComplete;
