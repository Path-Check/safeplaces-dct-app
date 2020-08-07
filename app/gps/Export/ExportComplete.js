import React from 'react';
import { useTranslation } from 'react-i18next';

import ExportTemplate from './ExportTemplate';
import { Screens } from '../../navigation';

export const ExportComplete = ({ navigation }) => {
  const { t } = useTranslation();
  const onClose = () => navigation.navigate(exportExitRoute);

  const exportExitRoute = Screens.ExportStart;

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
