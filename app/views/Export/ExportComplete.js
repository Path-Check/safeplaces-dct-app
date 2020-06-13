import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAssets } from '../../TracingStrategyAssets';
import ExportTemplate from './ExportTemplate';

export const ExportComplete = ({ navigation }) => {
  const { t } = useTranslation();
  const { exportCompleteBody, exportExitRoute } = useAssets();
  const onClose = () => navigation.navigate(exportExitRoute);

  return (
    <ExportTemplate
      lightTheme
      onNext={onClose}
      nextButtonLabel={t('common.done')}
      headline={t('export.complete_title')}
      body={exportCompleteBody}
    />
  );
};

export default ExportComplete;
